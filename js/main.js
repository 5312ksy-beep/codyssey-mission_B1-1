/* ============================================
   7단계 - 기본 인터랙션
   ============================================ */

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

// ===== 1) 햄버거 메뉴 토글 =====
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  navLinks.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// ===== 2) 부드러운 스크롤 + 메뉴 닫기 =====
navItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    const targetId = item.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    closeMenu();
  });
});

// ===== 3) 스크롤 이벤트: 네비 그림자 + 스크롤탑 버튼 =====
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

handleScroll();

// ===== 4) 스크롤 탑 버튼 =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   8단계 - 다크모드 + localStorage
   ============================================ */

const themeToggle = document.querySelector('.theme-toggle');

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? '라이트모드 전환' : '다크모드 전환'
  );
}

// <head>의 인라인 스크립트가 이미 data-theme을 세팅했으므로 아이콘만 맞춘다.
updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);

  try {
    localStorage.setItem('theme', newTheme);
  } catch (e) {
    console.warn('테마를 저장하지 못했습니다.', e);
  }

  updateThemeIcon(newTheme);
});

/* ============================================
   9단계 - 스크롤 애니메이션 (Intersection Observer)
   ============================================ */

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: '0px' }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

/* ============================================
   10단계 - 폼 유효성 검사
   ============================================ */

const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const formSuccess = document.querySelector('#form-success');

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

// 실시간 검증
formFields.forEach((input) => {
  input.addEventListener('input', () => validateField(input));
});

let successTimer;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 모든 필드를 검증한다. every()는 단축 평가되므로 map()으로 전부 실행한다.
  const results = formFields.map((input) => validateField(input));
  const isValid = results.every(Boolean);

  if (!isValid) {
    const firstInvalid = formFields.find((input) =>
      input.classList.contains('invalid')
    );
    firstInvalid.focus();
    return;
  }

  formSuccess.hidden = false;
  contactForm.reset();
  formFields.forEach((input) => {
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    document.querySelector(`#${input.id}-error`).textContent = '';
  });

  clearTimeout(successTimer);
  successTimer = setTimeout(() => {
    formSuccess.hidden = true;
  }, 3000);
});

/* ============================================
   11단계 - GitHub API 연동
   ============================================ */

const GITHUB_USERNAME = '5312ksy-beep';
const projectsContainer = document.querySelector('#projects-container');

// 저장소 설명은 외부 입력이므로 그대로 innerHTML에 넣지 않고 이스케이프한다.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLoading() {
  projectsContainer.innerHTML = `
    <div class="status-message">
      <div class="spinner"></div>
      <p>프로젝트를 불러오는 중...</p>
    </div>
  `;
}

function renderError(message) {
  projectsContainer.innerHTML = `
    <div class="status-message">
      <p>${escapeHtml(message)}</p>
      <button class="btn btn-primary" type="button" id="retry-btn">다시 시도</button>
    </div>
  `;

  document.querySelector('#retry-btn').addEventListener('click', fetchProjects);
}

function renderEmpty() {
  projectsContainer.innerHTML = `
    <div class="status-message">
      <p>표시할 프로젝트가 없습니다.</p>
    </div>
  `;
}

function renderProjects(repos) {
  projectsContainer.innerHTML = repos
    .map(
      ({ name, description, html_url, stargazers_count, language }) => `
        <article class="project-card">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(description || '설명이 없습니다.')}</p>
          <div class="card-meta">
            <span>⭐ ${stargazers_count}</span>
            <span>${escapeHtml(language || '기타')}</span>
          </div>
          <a href="${escapeHtml(html_url)}" target="_blank" rel="noopener" class="btn btn-secondary">
            GitHub에서 보기
          </a>
        </article>
      `
    )
    .join('');
}

async function fetchProjects() {
  renderLoading();

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('GitHub 사용자를 찾을 수 없습니다.');
      }
      if (response.status === 403) {
        throw new Error(
          'GitHub API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
      throw new Error(`프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`);
    }

    const repos = await response.json();

    if (repos.length === 0) {
      renderEmpty();
    } else {
      renderProjects(repos);
    }
  } catch (error) {
    console.error('GitHub API 호출 실패:', error);
    renderError(error.message || '프로젝트를 불러올 수 없습니다.');
  }
}

fetchProjects();
