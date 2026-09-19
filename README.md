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

## 코드 아키텍처

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

### STATE

화면에 영향을 주는 값을 지역 변수로 흩어놓지 않고 한 객체에 모았습니다.
`console.log(STATE)` 한 줄로 현재 화면 상태 전체를 확인할 수 있습니다.

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

프로젝트 목록은 `isLoading` / `hasError` 같은 플래그를 따로 두지 않고
`status` 문자열 하나로 관리합니다. 네 값 중 항상 하나만 성립하므로
"로딩 중이면서 동시에 에러" 같은 불가능한 조합이 생기지 않습니다.

### CONFIG

매직 넘버가 코드 중간에 흩어지지 않도록 설정값을 분리했습니다.

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

### GitHub API 데이터 변환

```
[원본 응답: 저장소당 80여 개 필드]
   ↓ filter   포크한 저장소 제외
   ↓ map      화면에 필요한 5개 필드로 정리 + 빈 값 기본 처리
[STATE.projects.items 에 저장]
   ↓ map      카드 HTML 문자열로 변환
   ↓ join('') 하나의 문자열로 합침
[innerHTML 삽입]
```

저장소 설명은 외부 입력이므로 `escapeHtml()`로 이스케이프한 뒤 삽입합니다.

---

## 테스트

### 반응형

`Ctrl+Shift+M`(기기 툴바)으로 375px / 768px / 1200px을 확인합니다.

### GitHub API 상태별 UI

`js/main.js`의 `CONFIG.githubUsername`을 바꿔 확인합니다.

| 값 | 결과 |
| --- | --- |
| `'5312ksy-beep'` | 정상 — 카드 목록 |
| `'asdfasdf12345678'` | 404 → 에러 UI + 재시도 버튼 |
| 저장소가 없는 계정 | 빈 상태 UI |
| 새로고침 60회 이상 반복 | 403 → 호출 한도 초과 메시지 |

> 인증 없이 GitHub API를 호출하면 IP당 시간당 60회 제한이 있습니다.
> 개발 중 새로고침을 반복하면 쉽게 걸리니 주의하세요.

---

## 구현하면서 만난 문제와 해결

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| PowerShell에서 `mkdir -p a/{b,c}` 실패 | 중괄호 확장은 bash 문법 | `New-Item -ItemType Directory -Force -Path a\b, a\c` |
| 앵커 이동 시 제목이 헤더에 가림 | 헤더가 `position: fixed` | 섹션에 `scroll-margin-top` 추가 |
| 스크롤 탑 버튼 페이드가 재생 안 됨 | `hidden`은 `display: none`이라 트랜지션 불가 | `visibility` + `opacity` 조합으로 변경 |
| 빈 폼 제출 시 첫 에러만 표시 | `every()`의 단축 평가 | 전체 필드를 `forEach`로 먼저 검증한 뒤 결과 집계 |
| 404 응답인데 `catch`로 안 감 | `fetch`는 HTTP 에러를 reject하지 않음 | `response.ok` 확인 후 직접 `throw` |
| 새로고침 시 화면이 흰색으로 번쩍임 (FOUC) | `defer` 스크립트는 렌더링 이후 실행 | `<head>`에 테마 복원 인라인 스크립트 추가 |
| JS 파일 전체가 문법 오류 | 주석 안에 쓴 `*/` 문자열이 블록 주석을 조기 종료 | 해당 문자열 제거 |
| 저장소 설명에 HTML이 들어갈 위험 | `innerHTML`은 문자열을 마크업으로 해석 | `escapeHtml()`로 이스케이프 후 삽입 |
| 프로필 사진의 머리카락·턱선이 잘림 | `object-fit: cover`가 원을 채우려고 잘라냄 | 배경이 흰색이므로 `contain`으로 전환 |
| 푸시했는데 사이트가 그대로 | 브라우저가 CSS를 캐시 | `Ctrl+Shift+R` 강력 새로고침 |

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

## 배포 (GitHub Pages)

```powershell
git add .
git commit -m "커밋 메시지"
git push origin main
```

1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)` → **Save**

> `index.html`은 반드시 저장소 **최상위**에 있어야 합니다. GitHub Pages의 브랜치 배포는
> 루트 또는 `/docs` 폴더만 지원합니다.

## 라이선스

MIT
