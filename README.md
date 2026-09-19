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

- **반응형 레이아웃** — 모바일 / 태블릿(768px) / 데스크톱(1024px) 3단계 브레이크포인트
- **다크모드** — `localStorage`에 저장되어 새로고침 후에도 유지, FOUC 방지 처리 포함
- **햄버거 메뉴** — 모바일에서 드롭다운 토글, 메뉴 선택 시 자동 닫힘
- **부드러운 스크롤** — 네비게이션 클릭 시 해당 섹션으로 이동
- **스크롤 애니메이션** — Intersection Observer(`threshold: 0.2`)로 섹션 fade-in
- **네비게이션 상태 변화** — 스크롤 60px 이상에서 그림자 표시
- **스크롤 탑 버튼** — 스크롤 300px 이상에서 노출
- **GitHub API 연동** — 로딩 / 성공 / 에러 / 빈 상태 4가지 UI 처리, 재시도 버튼 제공
- **폼 유효성 검사** — 실시간 검증 + 제출 시 전체 검증, 에러 메시지 인라인 표시
- **접근성** — `aria-label`, `aria-expanded`, `aria-live`, 본문 바로가기 링크, `prefers-reduced-motion` 대응

## 파일 구조

```
codyssey-mission_B1-1/
├── index.html          # 시맨틱 마크업
├── css/
│   └── style.css       # 변수 + 레이아웃 + 반응형 + 시각 효과
├── js/
│   └── main.js         # 인터랙션 + 다크모드 + 폼 + GitHub API
├── images/
│   └── profile.jpg     # 프로필 이미지
└── README.md
```

## 로컬에서 실행하기 (Windows)

`file://`로 직접 열면 Fetch API가 CORS 정책에 막히므로 반드시 로컬 서버로 실행합니다.

**방법 1 — VS Code Live Server (권장)**

1. VS Code에서 이 폴더를 엽니다
2. 확장(`Ctrl+Shift+X`)에서 "Live Server" 설치
3. `index.html` 우클릭 → **Open with Live Server**
4. 브라우저에서 `http://127.0.0.1:5500` 자동 실행

**방법 2 — Python 내장 서버**

```powershell
python -m http.server 5500
```

브라우저에서 `http://127.0.0.1:5500` 접속.

---

# 단계별 구현 가이드

아래는 이 프로젝트를 처음부터 만드는 순서입니다. 명령어는 **Windows PowerShell 기준**입니다.

## 1단계 — 환경 세팅

### 폴더와 파일 생성

PowerShell은 bash의 중괄호 확장(`{css,js,images}`)과 `touch` 명령을 지원하지 않습니다.
아래 명령을 사용합니다.

```powershell
New-Item -ItemType Directory -Force -Path css, js, images
New-Item -ItemType File -Force -Path index.html, css\style.css, js\main.js
```

> **참고:** macOS / Linux에서는 다음과 같습니다.
> ```bash
> mkdir -p {css,js,images}
> touch index.html css/style.css js/main.js
> ```

### 연결 확인

먼저 아래 내용만 넣고 CSS와 JS가 제대로 연결되는지 확인합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>포트폴리오</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>연결 테스트</h1>
  <script src="js/main.js" defer></script>
</body>
</html>
```

- `css/style.css` → `h1 { color: red; }`
- `js/main.js` → `console.log('JS 연결됨');`

빨간 글씨가 보이고 개발자도구(`F12`) 콘솔에 로그가 찍히면 세팅 완료입니다.

> `defer` 속성은 HTML 파싱이 끝난 뒤 스크립트를 실행하게 합니다.
> 이것 덕분에 `main.js` 상단에서 바로 `querySelector`를 써도 요소를 찾을 수 있습니다.

## 2단계 — HTML 뼈대 (시맨틱 마크업)

`<body>` 안을 6개 영역으로 구성합니다. 이 단계에서는 내용보다 **구조**에 집중합니다.

```html
<header id="header">
  <nav>
    <a href="#hero" class="logo">강서연</a>
    <ul class="nav-links" id="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button class="theme-toggle" type="button" aria-label="다크모드 전환">🌙</button>
      <button class="hamburger" type="button" aria-label="메뉴 열기"
              aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</header>

<main>
  <section id="hero">...</section>
  <section id="about" class="fade-in">...</section>
  <section id="skills" class="fade-in">...</section>
  <section id="projects" class="fade-in">
    <div id="projects-container" aria-live="polite"><!-- JS가 채움 --></div>
  </section>
  <section id="contact" class="fade-in">
    <form id="contact-form" novalidate>...</form>
  </section>
</main>

<footer>...</footer>
<button class="scroll-top" type="button" aria-label="맨 위로">↑</button>
<script src="js/main.js" defer></script>
```

### 이 단계 체크리스트

| 요구사항 | 확인 |
| --- | --- |
| 시맨틱 태그 `<header> <nav> <main> <section> <footer>` 사용 | ✅ |
| 6개 영역: Hero, About, Skills, Projects, Contact, Footer | ✅ |
| 앵커 링크(`href="#about"`)로 섹션 이동 | ✅ |
| 모든 이미지에 `alt` 속성 | ✅ |
| `<label for="name">` ↔ `<input id="name">` 매칭 | ✅ |
| `novalidate` — 브라우저 기본 검증을 끄고 JS로 직접 처리 | ✅ |

> **버튼에는 `type="button"`을 명시합니다.** `<form>` 안이 아니더라도 습관을 들여두면,
> 폼 내부에 버튼을 넣었을 때 기본값 `type="submit"` 때문에 의도치 않게 폼이 제출되는 문제를 막을 수 있습니다.

## 3단계 — CSS 변수 & 기본 스타일

색상을 CSS 변수로 정의해두면 다크모드를 **변수 재정의만으로** 구현할 수 있습니다.

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #2563eb;
  --color-card-bg: #f8fafc;
  --color-border: #e2e8f0;
  --color-error: #dc2626;
  --color-success: #16a34a;

  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  --border-radius: 8px;
  --transition-speed: 0.3s;
  --header-height: 72px;
}

[data-theme='dark'] {
  --color-bg: #0f172a;
  --color-text: #e2e8f0;
  --color-primary: #3b82f6;
  --color-card-bg: #1e293b;
  --color-border: #334155;
}
```

리셋과 기본 타이포그래피를 잡습니다.

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-main);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

section {
  padding: var(--spacing-xl) var(--spacing-md);
  scroll-margin-top: var(--header-height);  /* 고정 헤더에 제목이 가려지지 않게 */
}
```

> **`scroll-margin-top`이 중요합니다.** 헤더가 `position: fixed`인 상태에서 앵커 링크로
> 이동하면 섹션 제목이 헤더 아래에 가려집니다. 이 속성으로 헤더 높이만큼 여백을 확보합니다.

한글 폰트는 Pretendard를 사용했습니다.

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
```

## 4단계 — 레이아웃

### 네비게이션 (Flexbox)

```css
header {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--color-nav-bg);
  backdrop-filter: blur(10px);
  transition: box-shadow var(--transition-speed);
}

header.scrolled { box-shadow: 0 2px 10px var(--color-shadow); }

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;   /* 로고 왼쪽, 나머지 오른쪽 */
  align-items: center;
}
```

### Projects 카드 (Grid)

```css
#projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}
```

`auto-fit` + `minmax`를 쓰면 미디어 쿼리 없이도 화면 폭에 따라 열 개수가 자동 조절됩니다.

## 5단계 — 반응형 (모바일 퍼스트)

기본 CSS가 모바일이고, `min-width` 미디어 쿼리로 넓은 화면을 덧씌웁니다.

```css
/* 모바일 기본: 햄버거 보임, 메뉴는 숨겨진 드롭다운 */
.hamburger { display: flex; flex-direction: column; gap: 5px; }

.nav-links {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%; left: 0;
  width: 100%;
  background-color: var(--color-nav-bg);
  padding: var(--spacing-md);
  text-align: center;
}

.nav-links.active { display: flex; }

/* 태블릿 이상: 반대로 */
@media (min-width: 768px) {
  .hamburger { display: none; }
  .nav-links {
    display: flex;
    flex-direction: row;
    position: static;
    width: auto;
    padding: 0;
  }
  .about-content { flex-direction: row; text-align: left; }
}
```

> `.nav-links`가 `position: absolute`일 때 기준이 되는 요소는 `position: fixed`인
> `<header>`입니다. `top: 100%`는 헤더 바로 아래를 의미합니다.

## 6단계 — 시각 효과

버튼 호버, 카드 호버, 스크롤 탑 버튼, fade-in 애니메이션을 정의합니다.

```css
.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.scroll-top {
  position: fixed;
  bottom: 2rem; right: 2rem;
  opacity: 0;
  visibility: hidden;          /* 숨김 상태에서 클릭 안 되게 */
  transform: translateY(20px);
  transition: opacity var(--transition-speed),
              transform var(--transition-speed),
              visibility var(--transition-speed);
}

.scroll-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible { opacity: 1; transform: translateY(0); }
```

> **`hidden` 속성 대신 `visibility`를 씁니다.** `hidden`은 `display: none`이라 트랜지션이
> 재생되지 않습니다. `visibility: hidden` + `opacity: 0` 조합이면 페이드 효과가 정상 동작하면서
> 숨겨진 버튼이 클릭을 가로채지도 않습니다.

접근성을 위해 모션 최소화 설정도 존중합니다.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .fade-in { opacity: 1; transform: none; }
}
```

## 7단계 — JS 기본 인터랙션

```js
const header = document.querySelector('#header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.querySelector('.scroll-top');

const HEADER_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}

// 햄버거 토글
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  navLinks.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// 부드러운 스크롤 + 메뉴 닫기 (하나의 핸들러로 통합)
navItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    const targetSection = document.querySelector(item.getAttribute('href'));
    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  });
});
```

> **같은 요소에 핸들러를 두 번 붙이지 않습니다.** "메뉴 닫기"와 "부드러운 스크롤"을 별도
> `forEach`로 나누면 동일한 클릭에 리스너가 두 개 등록되어 추적이 어려워집니다. 하나로 합칩니다.

스크롤 이벤트는 `requestAnimationFrame`으로 스로틀링합니다.

```js
let scrollTicking = false;

function handleScroll() {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
  scrollTopBtn.classList.toggle('visible', scrollY > SCROLL_TOP_THRESHOLD);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(handleScroll);
  }
});

handleScroll();   // 새로고침으로 중간 위치에서 시작한 경우를 위해 초기 1회 실행

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

> **스크롤 이벤트는 초당 수십~수백 번 발생합니다.** 매번 DOM을 만지면 끊김이 생기므로
> `requestAnimationFrame`으로 프레임당 한 번만 처리되게 묶습니다.

## 8단계 — 다크모드 + localStorage

```js
const themeToggle = document.querySelector('.theme-toggle');

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label',
    theme === 'dark' ? '라이트모드 전환' : '다크모드 전환');
}

updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);   // 1. 상태 변경

  try {
    localStorage.setItem('theme', newTheme);                       // 2. 저장
  } catch (e) {
    console.warn('테마를 저장하지 못했습니다.', e);
  }

  updateThemeIcon(newTheme);                                       // 3. 화면 반영
});
```

> **`localStorage` 접근은 `try/catch`로 감쌉니다.** 시크릿 모드나 사이트 데이터가 차단된
> 브라우저에서는 `setItem`이 예외를 던집니다. 감싸지 않으면 그 시점에 스크립트 전체가 멈춥니다.

### FOUC(화면 깜빡임) 방지

`defer` 스크립트 안에서 테마를 불러오면 **HTML 파싱 → 라이트 모드 렌더링 → JS 실행 → 다크 모드 적용**
순서가 되어 화면이 한 번 번쩍입니다. `<head>`에 즉시 실행 스크립트를 넣어 해결합니다.

```html
<link rel="stylesheet" href="css/style.css">
<script>
  // CSS가 그려지기 전에 테마 속성을 먼저 세팅한다.
  try {
    var saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
</script>
```

## 9단계 — 스크롤 애니메이션 (Intersection Observer)

애니메이션을 적용할 섹션에 `class="fade-in"`을 붙입니다.

```js
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);   // 한 번만 실행
      }
    });
  },
  { threshold: 0.2, rootMargin: '0px' }
);

fadeElements.forEach((el) => fadeObserver.observe(el));
```

**동작 순서**

1. 초기 상태: `.fade-in`은 `opacity: 0`, `translateY(30px)`
2. 요소가 뷰포트에 20% 이상 들어오면 Observer가 감지
3. `.visible` 추가 → CSS 트랜지션으로 부드럽게 나타남
4. `unobserve`로 관찰 해제 → 다시 스크롤해도 반복되지 않음

> 스크롤 이벤트로 `getBoundingClientRect()`를 계속 계산하는 방식보다 훨씬 가볍습니다.
> 브라우저가 렌더링 파이프라인 안에서 교차 여부를 판단해주기 때문입니다.

## 10단계 — 폼 유효성 검사

검증 규칙을 객체로 분리하면 필드가 늘어나도 코드가 늘어나지 않습니다.

```js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (v) => (v === '' ? '이름을 입력해주세요.' : ''),
  email: (v) => {
    if (v === '') return '이메일을 입력해주세요.';
    if (!emailRegex.test(v)) return '올바른 이메일 형식이 아닙니다.';
    return '';
  },
  message: (v) => {
    if (v === '') return '메시지를 입력해주세요.';
    if (v.length < 10) return '메시지는 10자 이상 입력해주세요.';
    return '';
  },
};

function validateField(input) {
  const errorEl = document.querySelector(`#${input.id}-error`);
  const errorMessage = validators[input.id](input.value.trim());

  errorEl.textContent = errorMessage;
  input.classList.toggle('invalid', Boolean(errorMessage));
  input.setAttribute('aria-invalid', String(Boolean(errorMessage)));

  return !errorMessage;
}

const formFields = [nameInput, emailInput, messageInput];

formFields.forEach((input) => {
  input.addEventListener('input', () => validateField(input));
});
```

제출 처리:

```js
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();   // 페이지 새로고침 방지

  // every()는 단축 평가되므로 map()으로 모든 필드를 먼저 검증한다
  const results = formFields.map((input) => validateField(input));
  const isValid = results.every(Boolean);

  if (!isValid) {
    formFields.find((i) => i.classList.contains('invalid')).focus();
    return;
  }

  formSuccess.hidden = false;
  contactForm.reset();
  // ... 에러 표시 초기화 ...

  clearTimeout(successTimer);
  successTimer = setTimeout(() => { formSuccess.hidden = true; }, 3000);
});
```

> **`formFields.every(validateField)`로 쓰면 안 됩니다.** `every()`는 첫 `false`에서 멈추기
> 때문에 이름만 비어 있어도 이메일·메시지 에러는 표시되지 않습니다. `map()`으로 전부 실행한 뒤
> 결과를 합산해야 모든 에러가 한 번에 보입니다.

> **에러 메시지 영역에 `min-height: 1.2em`을 줍니다.** 그렇지 않으면 메시지가 나타날 때마다
> 아래 요소들이 밀려 레이아웃이 튑니다.

## 11단계 — GitHub API 연동

이 프로젝트의 핵심입니다. `fetch` + `async/await`로 **로딩 / 성공 / 에러 / 빈 상태** 4가지를 모두 처리합니다.

```js
const GITHUB_USERNAME = '5312ksy-beep';
const projectsContainer = document.querySelector('#projects-container');

// 저장소 설명은 외부 입력이므로 그대로 innerHTML에 넣지 않는다
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchProjects() {
  renderLoading();                                   // 1. 로딩

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );

    if (!response.ok) {
      if (response.status === 404) throw new Error('GitHub 사용자를 찾을 수 없습니다.');
      if (response.status === 403) throw new Error('GitHub API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      throw new Error(`프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`);
    }

    const repos = await response.json();

    if (repos.length === 0) {
      renderEmpty();                                 // 3. 빈 상태
    } else {
      renderProjects(repos);                         // 2. 성공
    }
  } catch (error) {
    console.error('GitHub API 호출 실패:', error);
    renderError(error.message);                      // 4. 에러
  }
}

fetchProjects();
```

카드 렌더링에는 구조분해 할당 + `map` + 템플릿 리터럴을 씁니다.

```js
function renderProjects(repos) {
  projectsContainer.innerHTML = repos
    .map(({ name, description, html_url, stargazers_count, language }) => `
      <article class="project-card">
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(description || '설명이 없습니다.')}</p>
        <div class="card-meta">
          <span>⭐ ${stargazers_count}</span>
          <span>${escapeHtml(language || '기타')}</span>
        </div>
        <a href="${escapeHtml(html_url)}" target="_blank" rel="noopener"
           class="btn btn-secondary">GitHub에서 보기</a>
      </article>
    `)
    .join('');
}
```

> **`fetch`는 HTTP 에러에서 reject되지 않습니다.** 404나 403도 "요청은 성공했다"로 취급되어
> `catch`로 넘어가지 않습니다. 반드시 `response.ok`를 직접 확인하고 `throw`해야 합니다.

> **외부 데이터를 `innerHTML`에 넣을 때는 이스케이프합니다.** 저장소 설명은 누구나 바꿀 수 있는
> 값이라 `<img onerror=...>` 같은 문자열이 들어오면 그대로 실행됩니다. `escapeHtml`로 막습니다.

> **`rel="noopener"`를 붙입니다.** `target="_blank"`로 열린 페이지가 `window.opener`를 통해
> 원본 탭을 조작하는 것을 차단합니다.

### API 호출 한도 주의

인증 없이 GitHub API를 호출하면 **IP당 시간당 60회** 제한이 있습니다.
초과하면 403이 반환되고 에러 UI가 표시됩니다. 개발 중 새로고침을 반복하면 쉽게 걸리니 주의하세요.

## 12단계 — 점검

### 상태 → 렌더링 흐름 3가지

| # | 사용자 이벤트 | 상태 변경 | 화면 업데이트 |
| --- | --- | --- | --- |
| 1 | 다크모드 토글 클릭 | `data-theme` 속성 변경 + `localStorage` 저장 | CSS 변수 교체로 전체 색상 전환, 아이콘 변경 |
| 2 | 페이지 로드 / 재시도 클릭 | 로딩 → 성공·에러·빈 상태 | 스피너 → 카드 목록 / 에러+재시도 / 빈 메시지 |
| 3 | 폼 입력 및 제출 | 각 필드의 valid / invalid 판정 | 에러 메시지 표시·숨김, 테두리 색 변경, 성공 메시지 |

### 크로스 브라우징 체크리스트

- [ ] 개발자도구 → 기기 툴바 토글(`Ctrl+Shift+M`)
- [ ] 모바일(375px): 햄버거 동작, 세로 레이아웃
- [ ] 태블릿(768px): 메뉴 가로 전환, About 가로 배치
- [ ] 데스크톱(1024px+): 전체 레이아웃
- [ ] 다크모드 전환 후 새로고침 → 유지되는지, 깜빡임 없는지
- [ ] GitHub API 정상 로딩 / 에러 시 재시도 버튼 동작
- [ ] 폼: 빈 제출 → 에러 3개 동시 표시 / 잘못된 이메일 → 에러 / 정상 제출 → 성공
- [ ] 스크롤 애니메이션 동작
- [ ] 스크롤 탑 버튼: 300px 이상에서 노출, 클릭 시 상단 이동
- [ ] `Tab` 키만으로 모든 인터랙션 접근 가능한지

### 에러 상태 테스트 방법

`GITHUB_USERNAME`을 존재하지 않는 아이디(예: `asdfasdf12345678`)로 바꾸면 404 에러 UI를 확인할 수 있습니다.
빈 상태는 저장소가 하나도 없는 계정으로 테스트합니다.

## 13단계 — 배포

```powershell
git add .
git commit -m "feat: 포트폴리오 웹사이트 구현"
git push origin main
```

GitHub에서 Pages 설정:

1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)` 선택 → **Save**
4. 1~2분 후 `https://5312ksy-beep.github.io/codyssey-mission_B1-1/` 접속

> `index.html`은 반드시 저장소 **최상위**에 있어야 합니다. GitHub Pages의 브랜치 배포는
> 루트 또는 `/docs` 폴더만 지원하기 때문입니다.

---

## ES6+ 문법 사용 위치

| 문법 | 사용 위치 | 예시 |
| --- | --- | --- |
| `const` / `let` | 전체 (`var` 미사용) | `const header = document.querySelector('#header')` |
| 화살표 함수 | 이벤트 핸들러, 콜백 | `btn.addEventListener('click', () => {...})` |
| 템플릿 리터럴 | 카드 HTML 생성, 셀렉터 조합 | `` `#${input.id}-error` `` |
| 구조분해 할당 | API 응답에서 값 추출 | `({ name, description, html_url }) => ...` |
| `map` | 배열 → HTML 문자열 변환 | `repos.map(...).join('')` |
| `forEach` | DOM 컬렉션 순회 | `navItems.forEach((item) => ...)` |
| `every` / `find` | 폼 검증 결과 집계 | `results.every(Boolean)` |
| `async` / `await` | GitHub API 호출 | `async function fetchProjects()` |
| `try` / `catch` | 네트워크·스토리지 예외 처리 | `catch (error) { renderError(...) }` |
| 옵셔널 기본값 | 누락 필드 대체 | `description \|\| '설명이 없습니다.'` |

## 구현하면서 만난 문제와 해결

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| PowerShell에서 `mkdir -p a/{b,c}` 실패 | 중괄호 확장은 bash 문법 | `New-Item -ItemType Directory -Force -Path a\b, a\c` |
| 앵커 이동 시 제목이 헤더에 가림 | 헤더가 `position: fixed` | 섹션에 `scroll-margin-top` 추가 |
| 스크롤 탑 버튼 페이드가 재생 안 됨 | `hidden`은 `display: none`이라 트랜지션 불가 | `visibility` + `opacity` 조합으로 변경 |
| 빈 폼 제출 시 첫 에러만 표시 | `every()`의 단축 평가 | `map()`으로 전부 검증 후 결과 집계 |
| 404 응답인데 `catch`로 안 감 | `fetch`는 HTTP 에러를 reject하지 않음 | `response.ok` 확인 후 직접 `throw` |
| 새로고침 시 화면이 흰색으로 번쩍임 | `defer` 스크립트는 렌더링 이후 실행 | `<head>`에 테마 복원 인라인 스크립트 추가 |

## 라이선스

MIT
