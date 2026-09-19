# 포트폴리오 웹사이트

순수 HTML, CSS, JavaScript만으로 만든 반응형 포트폴리오 웹사이트입니다.
프레임워크와 빌드 도구 없이 브라우저 기본 API만 사용했습니다.

## 배포 URL

https://5312ksy-beep.github.io/codyssey-mission_B1-1/

## 사용 기술

| 분류 | 내용 |
| --- | --- |
| 마크업 | HTML5 시맨틱 태그 |
| 스타일 | CSS3 — 커스텀 속성(변수), Flexbox, Grid, 미디어 쿼리 |
| 스크립트 | JavaScript ES6+ — Fetch API, async/await, Intersection Observer, localStorage |
| 외부 연동 | GitHub REST API |
| 배포 | GitHub Pages |

## 주요 기능

- **반응형 레이아웃** — 모바일 기본 + 768px / 960px 브레이크포인트
- **다크모드** — `localStorage`에 저장되어 새로고침 후에도 유지, FOUC 방지 처리 포함
- **햄버거 메뉴** — 모바일에서 드롭다운 토글, 메뉴 선택 시 자동 닫힘
- **부드러운 스크롤** — 네비게이션 클릭 시 해당 섹션으로 이동
- **스크롤 애니메이션** — Intersection Observer(`threshold: 0.2`)로 섹션 fade-in
- **네비게이션 상태 변화** — 스크롤 60px 이상에서 테두리·그림자 표시
- **스크롤 탑 버튼** — 스크롤 300px 이상에서 노출
- **GitHub API 연동** — 로딩 / 성공 / 에러 / 빈 상태 4가지 UI 처리, 재시도 버튼 제공
- **폼 유효성 검사** — 실시간 검증 + 제출 시 전체 검증, 에러 메시지 인라인 표시
- **접근성** — `aria-label`, `aria-expanded`, `aria-live`, `aria-invalid`, 본문 바로가기 링크, `prefers-reduced-motion` 대응

## 파일 구조

```
codyssey-mission_B1-1/
├── index.html          # 구조 — 시맨틱 마크업
├── css/
│   └── style.css       # 표현 — 디자인 토큰 + 레이아웃 + 반응형 + 효과
├── js/
│   └── main.js         # 동작 — STATE + 렌더 함수 + 이벤트 바인딩
├── images/
│   └── profile.jpg     # 프로필 사진
└── README.md
```

## 로컬에서 실행하기 (Windows)

`file://`로 직접 열면 Fetch API가 CORS 정책에 막히므로 반드시 로컬 서버로 실행합니다.

**방법 1 — VS Code Live Server (권장)**

1. VS Code에서 이 폴더를 엽니다
2. 확장(`Ctrl+Shift+X`)에서 "Live Server" 설치
3. `index.html` 우클릭 → **Open with Live Server**

**방법 2 — Python 내장 서버**

```powershell
python -m http.server 5500
```

브라우저에서 `http://127.0.0.1:5500` 접속.

---

# 코드 아키텍처

`js/main.js`는 5개 블록으로 나뉘어 있고, 데이터는 **한 방향으로만** 흐릅니다.

```
[1] STATE          화면에 영향을 주는 모든 값을 담은 객체 하나
[2] elements       DOM 참조 모음
[3] render*()      STATE를 "읽어서" 화면을 그림  (STATE를 바꾸지 않음)
[4] setXxx()       STATE를 "바꾸고" render를 호출
[5] 이벤트 바인딩   addEventListener로 [4]를 연결
```

```
사용자 이벤트  →  setXxx()가 STATE 변경  →  render()가 화면 반영
     ↑                                              │
     └──────────────  단방향, 역류 없음  ────────────┘
```

### STATE 객체

```js
const STATE = {
  theme: 'light',
  isMenuOpen: false,
  isHeaderScrolled: false,
  isScrollTopVisible: false,
  projects: {
    status: 'loading',   // 'loading' | 'success' | 'empty' | 'error'
    items: [],
    errorMessage: '',
  },
  formErrors: { name: '', email: '', message: '' },
  isFormSubmitted: false,
};
```

설정값은 `CONFIG`로 따로 분리해, 매직 넘버가 코드 중간에 흩어지지 않게 했습니다.

```js
const CONFIG = {
  githubUsername: '5312ksy-beep',
  repoCount: 6,
  headerScrollThreshold: 60,
  scrollTopThreshold: 300,
  fadeInThreshold: 0.2,
  successMessageDuration: 3000,
};
```

---

# 평가 항목 대응

## 항목 1 — 기능 동작

| 확인 항목 | 구현 위치 | 확인 방법 |
| --- | --- | --- |
| 창 크기를 줄이면 모바일 레이아웃으로 바뀌는가 | `style.css` 반응형 블록 | `Ctrl+Shift+M` → 375px / 768px / 1200px |
| 테마 토글 동작 + 새로고침 후 유지 | `setTheme()`, `renderTheme()` | 토글 클릭 → `F5` → 유지 확인 |
| 햄버거 / 스크롤 애니메이션 / 맨 위로 버튼 | `setMenuOpen()`, `fadeObserver`, `updateScrollState()` | 375px에서 햄버거, 스크롤 300px 이상 |
| GitHub API 로딩·에러·빈 상태 구분 | `loadProjects()`, `renderProjects()` | 아래 "에러 상태 테스트" 참고 |
| 필수값 누락·이메일 형식 오류 즉시 피드백 | `validateField()`, `renderFormErrors()` | 입력창에 타이핑하면서 확인 |

### 에러 상태 테스트 방법

`js/main.js`의 `CONFIG.githubUsername`을 바꿔 확인합니다.

| 값 | 결과 |
| --- | --- |
| `'5312ksy-beep'` | 정상 — 카드 목록 |
| `'asdfasdf12345678'` | 404 → 에러 UI + 재시도 버튼 |
| 저장소가 없는 계정 | 빈 상태 UI |
| 새로고침 60회 이상 반복 | 403 → 호출 한도 초과 메시지 |

## 항목 2 — 구조와 선택의 근거

### Q. HTML / CSS / JS를 파일로 분리한 이유와 각 파일의 역할은?

**관심사의 분리(Separation of Concerns)** 때문입니다. 셋은 답하는 질문이 다릅니다.

| 파일 | 답하는 질문 | 역할 |
| --- | --- | --- |
| `index.html` | **무엇이** 있는가 | 문서의 구조와 의미. 콘텐츠와 그 관계를 정의 |
| `css/style.css` | **어떻게 보이는가** | 색·간격·배치·전환 등 표현 |
| `js/main.js` | **어떻게 반응하는가** | 상태 관리와 사용자 상호작용 |

분리하면 얻는 것:

1. **수정 범위가 좁아집니다.** 색을 바꾸려면 CSS만 열면 되고, HTML·JS는 건드릴 필요가 없습니다.
2. **브라우저가 캐시할 수 있습니다.** HTML만 바뀌어도 CSS·JS는 캐시된 걸 재사용합니다.
3. **협업이 가능해집니다.** 디자이너는 CSS, 개발자는 JS를 동시에 작업해도 충돌이 적습니다.
4. **재사용됩니다.** 페이지가 늘어나도 같은 `style.css` 하나를 공유합니다.

### Q. 시맨틱 태그를 어떤 기준으로 선택했는가?

기준은 **"화면에서 어떻게 보이는가"가 아니라 "이 영역이 문서에서 무슨 역할인가"** 입니다.

| 태그 | 사용 위치 | 선택 이유 |
| --- | --- | --- |
| `<header>` | 상단 고정 바 | 페이지 전체의 머리말 영역이라서 |
| `<nav>` | 메뉴 링크 묶음 | 주요 탐색 링크 모음이라서. 스크린리더가 "탐색으로 건너뛰기"를 제공 |
| `<main>` | 본문 전체 | 페이지의 핵심 콘텐츠. 문서당 하나만 존재해야 함 |
| `<section>` | Hero / About / Skills / Projects / Contact | 각각 제목(`h1`/`h2`)을 가진 독립 주제 단위라서 |
| `<article>` | 프로젝트 카드 | 카드 하나만 떼어내도 의미가 성립하는 독립 콘텐츠라서 |
| `<figure>` / `<figcaption>` | 프로필 카드 | 이미지와 그 설명이 한 덩어리라서 |
| `<footer>` | 하단 | 저작권·연락처 등 꼬리말 정보라서 |
| `<form>` / `<label>` | Contact | 입력 양식과 각 입력의 이름표 |

`<div>`를 쓴 곳은 **의미 없이 스타일을 위해 묶기만 하는 경우**(`.hero-inner`, `.form-group`)로 한정했습니다.

**얻는 것**: 스크린리더 사용자가 랜드마크 단위로 이동할 수 있고, 검색엔진이 문서 구조를 이해하며, CSS 클래스 이름 없이도 코드를 읽을 수 있습니다.

### Q. CSS 변수(`:root`)로 관리하면 무엇이 좋은가?

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --color-text: #0f172a;
}

[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-bg: #0b1120;
  --color-text: #e8eefc;
}
```

1. **한 곳만 고치면 전부 바뀝니다.** 주요 색상이 30곳에 쓰여도 `--color-primary` 한 줄만 수정하면 됩니다.
2. **다크모드가 거의 공짜가 됩니다.** 이게 가장 큰 이점입니다. `[data-theme='dark']`에서 **변수 값만 다시 정의**하면, 그 변수를 쓰는 모든 규칙이 자동으로 따라옵니다. 다크모드용 CSS를 따로 쓸 필요가 없습니다.
3. **런타임에 바뀝니다.** Sass 변수는 빌드 시점에 고정되지만, CSS 변수는 JS로 즉시 바꿀 수 있습니다. 그래서 `setAttribute('data-theme', ...)` 한 줄로 전체 색상이 전환됩니다.
4. **이름이 의도를 설명합니다.** `#2563eb`보다 `--color-primary`가 무엇인지 읽힙니다.
5. **상속됩니다.** 특정 영역에서만 값을 덮어쓰면 그 하위에만 적용됩니다.

### Q. `onclick` 대신 `addEventListener`를 쓴 이유는?

| 비교 항목 | `onclick="fn()"` | `addEventListener('click', fn)` |
| --- | --- | --- |
| 핸들러 개수 | **1개만.** 두 번째를 넣으면 앞엣것을 덮어씀 | **여러 개 등록 가능.** 등록 순서대로 전부 실행 |
| 코드 위치 | HTML 안에 JS가 섞임 | JS 파일에 모임 (관심사 분리) |
| 제거 | 불가능에 가까움 | `removeEventListener`로 제거 |
| 이벤트 단계 | 버블링만 | 캡처 단계도 선택 가능 (`{ capture: true }`) |
| 부가 옵션 | 없음 | `{ once: true }`, `{ passive: true }` 등 |
| 동적 요소 | 문자열로 HTML을 만들어야 해서 취약 | 생성 직후 코드로 안전하게 연결 |
| 보안 | 인라인 스크립트라 CSP에서 차단됨 | CSP 환경에서 정상 동작 |

이 프로젝트에서 실제로 문제가 됐을 지점 — **재시도 버튼**은 에러가 날 때마다 JS가 새로 만들어내는 요소입니다.

```js
document.querySelector('#retry-btn').addEventListener('click', loadProjects);
```

`onclick`이었다면 문자열 안에 전역 함수 이름을 박아 넣어야 하고, 함수 이름을 바꾸는 순간 조용히 깨집니다.

## 항목 3 — 코드 흐름 설명

### Q. "이벤트 → 상태 변경 → 화면 업데이트" 흐름을 짚어달라 (다크모드 예시)

**1단계 — 이벤트**: 토글 버튼 클릭을 `addEventListener`가 받습니다.

```js
elements.themeToggle.addEventListener('click', () => {
  setTheme(STATE.theme === 'dark' ? 'light' : 'dark');
});
```

**2단계 — 상태 변경**: `setTheme()`이 `STATE.theme`을 바꾸고 `localStorage`에 저장합니다.
여기서는 DOM을 직접 건드리지 않습니다.

```js
function setTheme(theme) {
  STATE.theme = theme;                       // ← 상태 변경
  try {
    localStorage.setItem('theme', theme);    // ← 영속화
  } catch (error) {
    console.warn('테마를 저장하지 못했습니다.', error);
  }
  renderTheme();                             // ← 화면 갱신 요청
}
```

**3단계 — 화면 업데이트**: `renderTheme()`이 `STATE`를 읽어 DOM에 반영합니다.

```js
function renderTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  const isDark = STATE.theme === 'dark';
  elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
  elements.themeToggle.setAttribute('aria-label', isDark ? '라이트모드 전환' : '다크모드 전환');
}
```

**4단계 — CSS가 이어받음**: `data-theme="dark"`가 붙는 순간 `[data-theme='dark']` 블록의 변수 값이 적용되고, 그 변수를 쓰는 모든 요소의 색이 한 번에 바뀝니다.

**핵심**: 클릭 핸들러는 DOM을 전혀 모릅니다. 상태만 바꾸고, 그리는 일은 `render`가 전담합니다. 나중에 "테마 토글을 헤더 말고 푸터에도 추가"해야 해도 `setTheme()`만 호출하면 되고, 렌더 코드는 손댈 필요가 없습니다.

### Q. `async/await` + `try/catch`로 성공·실패를 어떻게 분기했는가?

```js
async function loadProjects() {
  STATE.projects = { status: 'loading', items: [], errorMessage: '' };
  renderProjects();                       // ① 즉시 로딩 화면

  try {
    const response = await fetch(url);    // ② 네트워크 응답 대기

    if (!response.ok) {                   // ③ HTTP 에러를 직접 검사
      throw new Error(getErrorMessage(response.status));
    }

    const repos = await response.json();  // ④ 본문 파싱 대기
    const items = repos.filter(...).map(...);

    STATE.projects = {                    // ⑤ 성공 / 빈 상태 분기
      status: items.length === 0 ? 'empty' : 'success',
      items,
      errorMessage: '',
    };
  } catch (error) {                       // ⑥ 실패는 전부 여기로
    console.error('GitHub API 호출 실패:', error);
    STATE.projects = { status: 'error', items: [], errorMessage: error.message };
  }

  renderProjects();                       // ⑦ 최종 상태를 한 번만 렌더
}
```

**흐름 정리**

1. 함수 시작 시 `status: 'loading'` → 스피너 표시
2. `await fetch()` — 네트워크 끊김·DNS 실패 등은 여기서 reject → `catch`로 직행
3. **`response.ok` 검사가 필수인 이유**: `fetch`는 404·403 같은 HTTP 에러에서 **reject하지 않습니다.** "요청은 도착했고 응답도 받았다"로 보기 때문입니다. 그래서 직접 확인하고 `throw`해야 `catch`로 넘어갑니다. 이걸 빠뜨리면 404 응답 본문을 정상 데이터로 착각해 처리하다가 엉뚱한 곳에서 터집니다.
4. `catch`가 네트워크 에러와 `throw`한 HTTP 에러를 **한곳에서** 받습니다
5. `renderProjects()`는 `try`/`catch` **바깥**에 한 번만 둡니다. 성공이든 실패든 마지막에 반드시 한 번 그려지고, 렌더 호출이 중복되지 않습니다

`.then().catch()` 체인 대신 `async/await`를 쓴 이유는, 위에서 아래로 읽히는 동기 코드와 같은 순서로 읽을 수 있고 `try/catch`라는 익숙한 에러 처리 문법을 그대로 쓸 수 있기 때문입니다.

### Q. `map`, `filter`로 GitHub 데이터를 카드 UI로 바꾸는 과정은?

**1단계 — 원본 응답**: GitHub API는 저장소당 80개가 넘는 필드를 줍니다.

```json
[{ "name": "...", "description": "...", "html_url": "...",
   "stargazers_count": 0, "language": "Python", "fork": false,
   "watchers": 0, "owner": { ... }, ... }]
```

**2단계 — `filter`로 걸러내기**: 포크한 저장소는 내 작업물이 아니므로 제외합니다.

```js
repos.filter((repo) => !repo.fork)
```

`filter`는 **개수를 줄입니다.** 콜백이 `true`를 반환한 요소만 남은 새 배열을 만듭니다(원본은 그대로).

**3단계 — `map`으로 모양 바꾸기**: 화면에 필요한 5개 필드만 남기고 이름도 정리합니다.

```js
.map(({ name, description, html_url, stargazers_count, language }) => ({
  name,
  description: description || '설명이 없습니다.',   // null 대비
  url: html_url,
  stars: stargazers_count,
  language: language || '기타',
}))
```

`map`은 **개수는 그대로 두고 각 요소를 변환합니다.** 구조분해 할당으로 필요한 필드만 꺼냈고, `||`로 빈 값의 기본값을 여기서 미리 채웠습니다. 덕분에 렌더 함수는 값이 비었는지 신경 쓸 필요가 없습니다.

**4단계 — `map`으로 HTML 문자열 만들기**: 이 결과를 `STATE.projects.items`에 저장하고, 렌더 단계에서 다시 `map`으로 카드 마크업을 만듭니다.

```js
items
  .map(({ name, description, url, stars, language }) => `
    <article class="project-card">
      <h3>${escapeHtml(name)}</h3>
      ...
    </article>
  `)
  .join('');
```

**5단계 — `join('')`으로 합치기**: `map`의 결과는 문자열 **배열**입니다. 그냥 넣으면 요소 사이에 쉼표가 찍히므로 `join('')`으로 하나의 문자열로 합칩니다.

```
[원본 80필드 × N개]
   ↓ filter   개수를 줄임 (포크 제외)
[N' 개]
   ↓ map      모양을 바꿈 (5필드만, 기본값 채움)
[{name, description, url, stars, language} × N']  ← STATE에 저장
   ↓ map      HTML 문자열로 변환
['<article>...', '<article>...']
   ↓ join('') 하나로 합침
'<article>...</article><article>...</article>'
```

`for` 루프 대신 쓴 이유는 **원본을 바꾸지 않고**(불변성) **각 단계가 하나의 일만 하기** 때문입니다. "거르고 → 바꾸고 → 합친다"가 코드에 그대로 드러납니다.

> **보안 처리**: 저장소 설명은 누구나 수정할 수 있는 외부 입력입니다. `<img src=x onerror=alert(1)>` 같은 값이 들어오면 `innerHTML`이 그대로 실행하므로, `escapeHtml()`로 `<`, `>`, `&`, 따옴표를 엔티티로 변환한 뒤 넣습니다.

### Q. Flexbox와 Grid를 각각 어디에 썼고, 왜 그렇게 나눴는가?

**기준**: 한 방향으로 늘어놓으면 Flexbox, 행과 열을 함께 다루거나 반복되는 칸을 채우면 Grid.

| 적용 위치 | 선택 | 이유 |
| --- | --- | --- |
| 네비게이션 바 | **Flex** | 로고·메뉴·버튼을 가로 한 줄로 배치하고 `justify-content: space-between`으로 양끝 정렬 |
| 히어로 버튼, 태그 목록 | **Flex** | 한 줄로 늘어놓다가 좁아지면 `flex-wrap`으로 자연스럽게 줄바꿈 |
| 프로젝트 카드 내부 | **Flex (세로)** | 제목→설명→메타→버튼 세로 한 줄. `flex-grow: 1`을 설명에 줘서 **버튼 높이를 카드마다 맞춤** |
| 소셜 링크, 스킬 칩 | **Flex** | 개수가 유동적인 한 줄 나열 |
| 히어로 전체 배치 | **Grid** | 텍스트와 프로필 카드를 `1.1fr 0.9fr` 비율로 나누는 2열 구조 |
| 프로젝트 카드 목록 | **Grid** | `repeat(auto-fit, minmax(280px, 1fr))` — 화면 폭에 따라 열 개수가 **자동으로** 1→2→3열 |
| About 하이라이트, Skills 그룹 | **Grid** | 같은 `auto-fit` 패턴. 카드 개수가 바뀌어도 코드 수정 불필요 |

**Grid를 고른 결정적 이유**는 `auto-fit` + `minmax`입니다.

```css
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
```

"최소 280px을 확보하되, 들어갈 수 있는 만큼 열을 만들고 남는 공간은 똑같이 나눠 가져라"는 뜻입니다. **미디어 쿼리를 한 줄도 쓰지 않고** 반응형 카드 그리드가 완성됩니다. Flexbox로 같은 걸 하려면 `flex-basis`와 `gap`을 계산해 넣어야 하고, 마지막 줄의 카드가 홀로 남으면 폭이 어긋납니다.

반대로 네비게이션을 Grid로 만들면 열 개수를 미리 정해야 해서, 메뉴 항목이 하나 늘 때마다 CSS를 고쳐야 합니다. 그래서 개수가 유동적인 한 줄 배치는 Flex가 맞습니다.

## 항목 4 — 설계 판단

### Q. STATE 객체를 따로 만든 이유는? 그냥 변수로 하면 안 되는가?

**동작은 합니다.** 규모가 작으면 지역 변수로도 돌아갑니다. 문제는 화면에 영향을 주는 값이 늘어날 때입니다.

**변수로 흩어놓았을 때 생기는 문제**

1. **진실의 출처가 둘이 됩니다.**
   ```js
   let isMenuOpen = false;
   hamburger.classList.toggle('active');   // ← DOM도 상태를 들고 있음
   ```
   변수와 DOM 클래스가 각각 상태를 가지면, 한쪽만 바꾸는 코드가 생기는 순간 둘이 어긋납니다. "메뉴가 열렸다고 나오는데 화면은 닫혀 있는" 버그가 여기서 나옵니다.

2. **디버깅이 어려워집니다.** 상태가 파일 여기저기 흩어지면 지금 화면이 어떤 상태인지 알려면 변수를 하나씩 찍어봐야 합니다. STATE가 있으면 `console.log(STATE)` 한 줄로 전체가 보입니다.

3. **연관된 값이 따로 놉니다.**
   ```js
   let isLoading, projects, hasError, errorMessage;   // 4개가 제각각
   ```
   `isLoading = false`인데 `hasError`도 `false`이고 `projects`도 비어 있는 **불가능한 조합**이 만들어질 수 있습니다. 이 프로젝트는 하나의 `status` 문자열로 묶어서 이런 조합 자체를 막았습니다.
   ```js
   projects: { status: 'loading' | 'success' | 'empty' | 'error', items, errorMessage }
   ```
   `status`는 항상 네 값 중 **하나**입니다. 로딩이면서 동시에 에러인 상태는 만들 수 없습니다.

4. **렌더링 규칙이 무너집니다.** 상태가 모여 있으면 "STATE가 바뀌면 render를 부른다"는 규칙 하나로 끝납니다. 흩어져 있으면 값을 바꾸는 모든 지점에서 DOM 조작을 각각 기억해야 하고, 한 군데를 빠뜨리면 화면이 갱신되지 않습니다.

**정리**: STATE 객체는 *지금 이 화면이 어떤 상태인지*에 대한 **단일 진실 공급원(Single Source of Truth)** 입니다. React·Vue 같은 프레임워크가 하는 일의 핵심도 결국 이것이고, 이 프로젝트는 그 패턴을 프레임워크 없이 직접 구현한 것입니다.

### Q. 반응형을 "모바일 퍼스트"로 작성한 이유는?

**작성 방식**: 기본 CSS는 모바일용이고, `@media (min-width: ...)`로 넓은 화면을 덧씌웁니다.
이 프로젝트에는 `max-width` 미디어 쿼리가 **0개**입니다.

```css
/* 기본 = 모바일 */
.nav-links { display: none; }
.hamburger { display: flex; }

/* 768px 이상에서 덮어쓰기 */
@media (min-width: 768px) {
  .nav-links { display: flex; }
  .hamburger { display: none; }
}
```

**이유**

1. **제약이 큰 쪽부터 설계하게 됩니다.** 좁은 화면에서 먼저 시작하면 정말 필요한 것만 남기게 됩니다. 반대로 데스크톱부터 만들면 모바일에서 무엇을 덜어낼지 계속 고민하게 되고, 결국 `display: none`으로 감추는 코드가 쌓입니다.

2. **CSS가 짧아집니다.** 모바일은 대부분 1열 세로 배치라 기본값에 가깝습니다. 그래서 기본 스타일이 단순해지고, 복잡한 다단 레이아웃만 미디어 쿼리 안에 들어갑니다. 반대로 하면 기본이 복잡해지고 그걸 되돌리는 코드가 미디어 쿼리마다 반복됩니다.

3. **모바일에서 더 빠릅니다.** 모바일 브라우저는 기본 스타일만 적용하면 되고, `min-width` 조건이 맞지 않는 블록은 평가하지 않습니다.

4. **트래픽 비중이 모바일에 있습니다.** 포트폴리오는 링크로 공유되고, 링크는 대부분 휴대폰에서 먼저 열립니다.

5. **점진적 향상(Progressive Enhancement)에 맞습니다.** 작은 화면에서 동작하는 기본을 먼저 만들고, 공간이 생길 때 기능을 더하는 방향이 자연스럽습니다.

---

# 구현하면서 만난 문제와 해결

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| PowerShell에서 `mkdir -p a/{b,c}` 실패 | 중괄호 확장은 bash 문법 | `New-Item -ItemType Directory -Force -Path a\b, a\c` |
| 앵커 이동 시 제목이 헤더에 가림 | 헤더가 `position: fixed` | 섹션에 `scroll-margin-top` 추가 |
| 스크롤 탑 버튼 페이드가 재생 안 됨 | `hidden`은 `display: none`이라 트랜지션 불가 | `visibility` + `opacity` 조합으로 변경 |
| 빈 폼 제출 시 첫 에러만 표시 | `every()`의 단축 평가 | 전체 필드를 `forEach`로 먼저 검증한 뒤 결과 집계 |
| 404 응답인데 `catch`로 안 감 | `fetch`는 HTTP 에러를 reject하지 않음 | `response.ok` 확인 후 직접 `throw` |
| 새로고침 시 화면이 흰색으로 번쩍임 (FOUC) | `defer` 스크립트는 렌더링 이후 실행 | `<head>`에 테마 복원 인라인 스크립트 추가 |
| JS 파일 전체가 문법 오류 | 주석 안에 쓴 `set*/handle*`의 `*/`가 블록 주석을 조기 종료 | 주석에서 `*/` 문자열 제거 |
| 저장소 설명에 HTML이 들어갈 위험 | `innerHTML`은 문자열을 마크업으로 해석 | `escapeHtml()`로 이스케이프 후 삽입 |

### FOUC 방지 코드

```html
<link rel="stylesheet" href="css/style.css">
<script>
  // CSS가 그려지기 전에 테마 속성을 먼저 세팅한다 (defer 아님 = 즉시 실행)
  try {
    var saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
</script>
```

`main.js`는 이 값을 읽어 STATE를 맞추기만 합니다.

```js
STATE.theme = document.documentElement.getAttribute('data-theme') || 'light';
renderTheme();
```

---

# ES6+ 문법 사용 위치

| 문법 | 사용 위치 | 예시 |
| --- | --- | --- |
| `const` / `let` | 전체 (`var` 미사용) | `const STATE = { ... }` |
| 화살표 함수 | 이벤트 핸들러, 콜백 | `item.addEventListener('click', (event) => { ... })` |
| 템플릿 리터럴 | 카드 HTML 생성, 셀렉터 조합 | `` `#${field}-error` `` |
| 구조분해 할당 | API 응답에서 필드 추출 | `({ name, html_url, stargazers_count }) => ...` |
| 단축 속성명 | 객체 생성 | `{ name, items, url }` |
| `filter` | 포크 저장소 제외 | `repos.filter((repo) => !repo.fork)` |
| `map` | 데이터 변환, HTML 생성 | `items.map(...).join('')` |
| `forEach` | DOM 컬렉션 순회 | `elements.navItems.forEach(...)` |
| `every` | 폼 검증 결과 집계 | `Object.values(STATE.formErrors).every((m) => m === '')` |
| `find` | 첫 오류 필드 찾기 | `Object.keys(...).find((f) => STATE.formErrors[f] !== '')` |
| `Object.entries` / `Object.keys` / `Object.values` | STATE 객체 순회 | `Object.entries(STATE.formErrors).forEach(...)` |
| `async` / `await` | GitHub API 호출 | `const response = await fetch(url)` |
| `try` / `catch` | 네트워크·스토리지 예외 처리 | `catch (error) { STATE.projects = { status: 'error', ... } }` |
| 논리 연산 기본값 | 누락 필드 대체 | `description \|\| '설명이 없습니다.'` |
| 삼항 연산자 | 조건부 값 | `items.length === 0 ? 'empty' : 'success'` |

---

# 배포 (GitHub Pages)

```powershell
git add .
git commit -m "feat: 포트폴리오 웹사이트 구현"
git push origin main
```

1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)` → **Save**
4. 1~2분 후 `https://5312ksy-beep.github.io/codyssey-mission_B1-1/` 접속

> `index.html`은 반드시 저장소 **최상위**에 있어야 합니다. GitHub Pages의 브랜치 배포는
> 루트 또는 `/docs` 폴더만 지원합니다.

## 라이선스

MIT
