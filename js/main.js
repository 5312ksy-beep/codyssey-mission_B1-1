/* ============================================================
   포트폴리오 메인 스크립트

   구조:
     1) STATE      — 화면에 영향을 주는 모든 값을 한곳에 모은 객체
     2) elements   — DOM 참조 모음
     3) render*    — STATE를 읽어서 화면을 그리는 함수 (STATE를 바꾸지 않음)
     4) setXxx     — STATE를 바꾸고 render를 호출하는 함수
     5) 이벤트 바인딩

   모든 인터랙션은 "이벤트 → STATE 변경 → render 호출" 한 방향으로만 흐른다.
   ============================================================ */

/* ===== 1) 상태 =====================================================
   화면을 다시 그리는 데 필요한 값을 흩어진 지역 변수로 두지 않고
   STATE 하나에 모은다. 지금 화면이 어떤 상태인지 이 객체만 보면 알 수 있고,
   버그가 생겼을 때 console.log(STATE) 한 줄로 전체를 확인할 수 있다.
   ================================================================= */
const STATE = {
  theme: 'light',
  isMenuOpen: false,
  isHeaderScrolled: false,
  isScrollTopVisible: false,
  projects: {
    status: 'loading', // 'loading' | 'success' | 'empty' | 'error'
    items: [],
    errorMessage: '',
  },
  formErrors: {
    name: '',
    email: '',
    message: '',
  },
  isFormSubmitted: false,
};

const CONFIG = {
  githubUsername: '5312ksy-beep',
  repoCount: 6,
  headerScrollThreshold: 60,
  scrollTopThreshold: 300,
  fadeInThreshold: 0.2,
  successMessageDuration: 3000,
};

/* ===== 2) DOM 참조 ================================================= */
const elements = {
  header: document.querySelector('#header'),
  hamburger: document.querySelector('.hamburger'),
  navLinks: document.querySelector('.nav-links'),
  navItems: document.querySelectorAll('.nav-links a'),
  themeToggle: document.querySelector('.theme-toggle'),
  scrollTopBtn: document.querySelector('.scroll-top'),
  projectsContainer: document.querySelector('#projects-container'),
  form: document.querySelector('#contact-form'),
  formSuccess: document.querySelector('#form-success'),
  inputs: {
    name: document.querySelector('#name'),
    email: document.querySelector('#email'),
    message: document.querySelector('#message'),
  },
};

/* ===== 3) 렌더 함수 =================================================
   여기서는 STATE를 읽기만 한다. 값을 바꾸지 않는다.
   ================================================================= */

function renderTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);

  const isDark = STATE.theme === 'dark';
  elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
  elements.themeToggle.setAttribute(
    'aria-label',
    isDark ? '라이트모드 전환' : '다크모드 전환'
  );
}

function renderMenu() {
  elements.hamburger.classList.toggle('active', STATE.isMenuOpen);
  elements.navLinks.classList.toggle('active', STATE.isMenuOpen);
  elements.hamburger.setAttribute('aria-expanded', String(STATE.isMenuOpen));
  elements.hamburger.setAttribute(
    'aria-label',
    STATE.isMenuOpen ? '메뉴 닫기' : '메뉴 열기'
  );
}

function renderScrollUI() {
  elements.header.classList.toggle('scrolled', STATE.isHeaderScrolled);
  elements.scrollTopBtn.classList.toggle('visible', STATE.isScrollTopVisible);
}

function renderFormErrors() {
  Object.entries(STATE.formErrors).forEach(([field, message]) => {
    const input = elements.inputs[field];
    const errorEl = document.querySelector(`#${field}-error`);

    errorEl.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  });

  elements.formSuccess.hidden = !STATE.isFormSubmitted;
}

/* --- Projects: status 값 하나로 4가지 화면을 분기한다 --- */
function renderProjects() {
  const { status, items, errorMessage } = STATE.projects;

  if (status === 'loading') {
    elements.projectsContainer.innerHTML = `
      <div class="status-message">
        <div class="spinner"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>
    `;
    return;
  }

  if (status === 'error') {
    elements.projectsContainer.innerHTML = `
      <div class="status-message">
        <p>${escapeHtml(errorMessage)}</p>
        <button class="btn btn-primary" type="button" id="retry-btn">다시 시도</button>
      </div>
    `;
    document
      .querySelector('#retry-btn')
      .addEventListener('click', loadProjects);
    return;
  }

  if (status === 'empty') {
    elements.projectsContainer.innerHTML = `
      <div class="status-message">
        <p>표시할 프로젝트가 없습니다.</p>
      </div>
    `;
    return;
  }

  // status === 'success'
  elements.projectsContainer.innerHTML = items
    .map(
      ({ name, description, url, stars, language }) => `
        <article class="project-card">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(description)}</p>
          <div class="card-meta">
            <span>⭐ ${stars}</span>
            <span>${escapeHtml(language)}</span>
          </div>
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener"
             class="btn btn-secondary">GitHub에서 보기</a>
        </article>
      `
    )
    .join('');
}

/* ===== 4) 상태 변경 함수 ============================================
   STATE를 바꾼 뒤 반드시 대응하는 render를 호출한다.
   ================================================================= */

function setTheme(theme) {
  STATE.theme = theme;

  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // 시크릿 모드 등 저장이 막힌 환경에서도 화면 전환은 계속되어야 한다
    console.warn('테마를 저장하지 못했습니다.', error);
  }

  renderTheme();
}

function setMenuOpen(isOpen) {
  STATE.isMenuOpen = isOpen;
  renderMenu();
}

function updateScrollState() {
  const scrollY = window.scrollY;

  STATE.isHeaderScrolled = scrollY > CONFIG.headerScrollThreshold;
  STATE.isScrollTopVisible = scrollY > CONFIG.scrollTopThreshold;

  renderScrollUI();
}

/* ===== 폼 검증 ===================================================== */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => (value === '' ? '이름을 입력해주세요.' : ''),
  email: (value) => {
    if (value === '') return '이메일을 입력해주세요.';
    if (!emailRegex.test(value)) return '올바른 이메일 형식이 아닙니다.';
    return '';
  },
  message: (value) => {
    if (value === '') return '메시지를 입력해주세요.';
    if (value.length < 10) return '메시지는 10자 이상 입력해주세요.';
    return '';
  },
};

function validateField(field) {
  const value = elements.inputs[field].value.trim();
  STATE.formErrors[field] = validators[field](value);
  renderFormErrors();
}

function validateAllFields() {
  // Object.keys + forEach로 모든 필드를 빠짐없이 검증한다.
  // every()를 쓰면 첫 실패에서 멈춰 나머지 에러가 표시되지 않는다.
  Object.keys(validators).forEach((field) => {
    const value = elements.inputs[field].value.trim();
    STATE.formErrors[field] = validators[field](value);
  });

  renderFormErrors();

  return Object.values(STATE.formErrors).every((message) => message === '');
}

function resetForm() {
  elements.form.reset();
  Object.keys(STATE.formErrors).forEach((field) => {
    STATE.formErrors[field] = '';
  });
}

/* ===== GitHub API =================================================== */

// 저장소 설명은 외부 입력이므로 그대로 innerHTML에 넣지 않고 이스케이프한다
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getErrorMessage(status) {
  if (status === 404) return 'GitHub 사용자를 찾을 수 없습니다.';
  if (status === 403) {
    return 'GitHub API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  }
  return `프로젝트를 불러올 수 없습니다. (HTTP ${status})`;
}

async function loadProjects() {
  STATE.projects = { status: 'loading', items: [], errorMessage: '' };
  renderProjects();

  try {
    const url =
      `https://api.github.com/users/${CONFIG.githubUsername}/repos` +
      `?sort=updated&per_page=${CONFIG.repoCount}`;

    const response = await fetch(url);

    // fetch는 404·403에서도 reject되지 않으므로 직접 확인해야 한다
    if (!response.ok) {
      throw new Error(getErrorMessage(response.status));
    }

    const repos = await response.json();

    // filter: 포크한 저장소는 내 작업물이 아니므로 제외한다
    // map:    API 응답을 화면에 필요한 형태로만 추려서 변환한다
    const items = repos
      .filter((repo) => !repo.fork)
      .map(({ name, description, html_url, stargazers_count, language }) => ({
        name,
        description: description || '설명이 없습니다.',
        url: html_url,
        stars: stargazers_count,
        language: language || '기타',
      }));

    STATE.projects = {
      status: items.length === 0 ? 'empty' : 'success',
      items,
      errorMessage: '',
    };
  } catch (error) {
    console.error('GitHub API 호출 실패:', error);
    STATE.projects = {
      status: 'error',
      items: [],
      errorMessage: error.message || '프로젝트를 불러올 수 없습니다.',
    };
  }

  renderProjects();
}

/* ===== 5) 이벤트 바인딩 =============================================
   HTML에 onclick을 적지 않고 여기서 addEventListener로 연결한다.
   ================================================================= */

elements.themeToggle.addEventListener('click', () => {
  setTheme(STATE.theme === 'dark' ? 'light' : 'dark');
});

elements.hamburger.addEventListener('click', () => {
  setMenuOpen(!STATE.isMenuOpen);
});

elements.navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    const target = document.querySelector(item.getAttribute('href'));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }

    setMenuOpen(false);
  });
});

// 스크롤은 초당 수십 번 발생하므로 프레임당 한 번만 처리한다
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollTicking = false;
  });
});

elements.scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 입력 중 실시간 검증
Object.keys(elements.inputs).forEach((field) => {
  elements.inputs[field].addEventListener('input', () => validateField(field));
});

let successTimer;
elements.form.addEventListener('submit', (event) => {
  event.preventDefault(); // 기본 제출(페이지 새로고침)을 막는다

  if (!validateAllFields()) {
    const firstInvalid = Object.keys(STATE.formErrors).find(
      (field) => STATE.formErrors[field] !== ''
    );
    elements.inputs[firstInvalid].focus();
    return;
  }

  STATE.isFormSubmitted = true;
  resetForm();
  renderFormErrors();

  clearTimeout(successTimer);
  successTimer = setTimeout(() => {
    STATE.isFormSubmitted = false;
    renderFormErrors();
  }, CONFIG.successMessageDuration);
});

/* ===== 스크롤 애니메이션 ============================================
   스크롤 이벤트로 위치를 계산하는 대신 브라우저가 교차 여부를 알려준다.
   ================================================================= */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  { threshold: CONFIG.fadeInThreshold, rootMargin: '0px' }
);

document
  .querySelectorAll('.fade-in')
  .forEach((element) => fadeObserver.observe(element));

/* ===== 초기 실행 ==================================================== */

// <head> 인라인 스크립트가 이미 data-theme을 세팅했으므로 STATE를 그 값에 맞춘다
STATE.theme = document.documentElement.getAttribute('data-theme') || 'light';
renderTheme();

updateScrollState(); // 새로고침으로 중간 위치에서 시작한 경우 대비
loadProjects();
