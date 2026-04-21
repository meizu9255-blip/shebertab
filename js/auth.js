/* ═══════════════════════════════════════════════════════════
   SheberTab — Auth JS (Vanilla, Custom Backend)
   • Email/Password login & register via Node.js
   • Google / GitHub / Apple OAuth via Node.js
   • Particle background animation
═══════════════════════════════════════════════════════════ */

const BACKEND_URL = 'http://localhost:5000/api/auth';

/* ═══════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('ptcl');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId, particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '8,145,178' : '249,115,22',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(8,145,178,${0.06 * (1 - d / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('a-toast');
  const icon  = document.getElementById('t-icon');
  const title = document.getElementById('t-title');
  const msgEl = document.getElementById('t-msg');
  if (!toast) return;

  const map = { success: ['✅','Сәтті!'], error: ['❌','Қате!'], info: ['ℹ️','Ақпарат'] };
  const [ic, ti] = map[type] || map.info;
  icon.textContent  = ic;
  title.textContent = ti;
  msgEl.textContent = msg;

  toast.className = `a-toast ${type} show`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.className = 'a-toast', 350);
  }, 4200);
}

/* ═══════════════════════════════════════
   AUTH STATE CHECK (on page load)
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  const glassBox   = document.getElementById('glass-box');
  const profPanel  = document.getElementById('prof-panel');

  /* Check current session from Backend */
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch(`${BACKEND_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        showProfile(data.user);
      } else {
        localStorage.removeItem('token');
        if (glassBox) glassBox.style.display = 'flex';
        if (profPanel) profPanel.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
      if (glassBox) glassBox.style.display = 'flex';
      if (profPanel) profPanel.style.display = 'none';
    }
  } else {
    if (glassBox) glassBox.style.display = 'flex';
    if (profPanel) profPanel.style.display = 'none';
  }

  function showProfile(user) {
    const name  = user.name || user.full_name || user.email?.split('@')[0] || 'Пайдаланушы';
    const email = user.email;
    const nameEl = document.getElementById('p-name');
    const emailEl = document.getElementById('p-email');
    if(nameEl) nameEl.textContent = name;
    if(emailEl) emailEl.textContent = email;
    if (glassBox)  glassBox.style.display  = 'none';
    if (profPanel) profPanel.style.display = 'block';
  }

  /* ─── Logout ─── */
  const loBtn = document.getElementById('lo-btn');
  if (loBtn) {
    loBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      showToast('Жүйеден сәтті шықтыңыз!', 'info');
      setTimeout(() => window.location.href = 'index.html', 900);
    });
  }

  /* ─────────────────────────────────────
     OVERLAY PANEL SWITCH
  ───────────────────────────────────── */
  const goReg   = document.getElementById('go-reg');
  const goLogin = document.getElementById('go-login');
  const ovlLogin = document.getElementById('ovl-login-text');
  const ovlReg   = document.getElementById('ovl-reg-text');

  if (goReg) {
    goReg.addEventListener('click', () => {
      glassBox.classList.add('reg-mode');
      if(ovlLogin) ovlLogin.style.display = 'none';
      if(ovlReg) ovlReg.style.display   = 'block';
    });
  }
  if (goLogin) {
    goLogin.addEventListener('click', () => {
      glassBox.classList.remove('reg-mode');
      if(ovlLogin) ovlLogin.style.display = 'block';
      if(ovlReg) ovlReg.style.display   = 'none';
    });
  }

  /* ─────────────────────────────────────
     EYE TOGGLE (password visibility)
  ───────────────────────────────────── */
  document.querySelectorAll('.eye-b').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      const isText = inp.type === 'text';
      inp.type = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁️' : '🙈';
    });
  });

  /* ═══════════════════════════════════════
     LOGIN FORM
  ═══════════════════════════════════════ */
  const loginForm = document.getElementById('login-form');
  const liBtn     = document.getElementById('li-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('li-email').value.trim();
      const password = document.getElementById('li-pw').value;

      if (!email.includes('@')) return showToast('Email форматы дұрыс емес!', 'error');
      if (password.length < 6)  return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');

      liBtn.disabled = true;
      liBtn.innerHTML = '<span class="spin"></span>Кіріп жатыр...';

      try {
        const res = await fetch(`${BACKEND_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        liBtn.disabled = false;
        liBtn.innerHTML = 'Кіру →';

        if (!res.ok) {
          return showToast(data.error || 'Email немесе пароль қате!', 'error');
        }

        localStorage.setItem('token', data.token);
        showToast('Жүйеге сәтті кірдіңіз!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1200);

      } catch (err) {
        liBtn.disabled = false;
        liBtn.innerHTML = 'Кіру →';
        showToast('Сервермен байланыс жоқ!', 'error');
      }
    });
  }

  /* ═══════════════════════════════════════
     REGISTER FORM
  ═══════════════════════════════════════ */
  const regForm = document.getElementById('reg-form');
  const ruBtn   = document.getElementById('ru-btn');

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name            = document.getElementById('ru-name').value.trim();
      const email           = document.getElementById('ru-email').value.trim();
      const password        = document.getElementById('ru-pw').value;
      const confirmPassword = document.getElementById('ru-conf').value;

      if (name.length < 6)            return showToast('Аты-жөніңіз кемінде 6 символ болуы тиіс!', 'error');
      if (/\d/.test(name))            return showToast('Аты-жөніңізге сандар жазуға болмайды!', 'error');
      if (password.length < 6)        return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');
      if (password !== confirmPassword) return showToast('Құпиясөздер сәйкес келмейді!', 'error');

      ruBtn.disabled = true;
      ruBtn.innerHTML = '<span class="spin"></span>Тіркеліп жатыр...';

      try {
        const res = await fetch(`${BACKEND_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        ruBtn.disabled = false;
        ruBtn.innerHTML = 'Тіркелу →';

        if (!res.ok) {
          return showToast(data.error || 'Тіркелу кезінде қате орын алды!', 'error');
        }

        localStorage.setItem('token', data.token);
        showToast('Аккаунт жасалды! Жүйеге кірдіңіз.', 'success');
        regForm.reset();
        setTimeout(() => window.location.href = 'index.html', 1500);
      } catch (err) {
        ruBtn.disabled = false;
        ruBtn.innerHTML = 'Тіркелу →';
        showToast('Сервермен байланыс орнату мүмкін емес!', 'error');
      }
    });
  }

  /* ═══════════════════════════════════════
     OAUTH — Social Login
  ═══════════════════════════════════════ */
  function oauthLogin(provider) {
    window.location.href = `${BACKEND_URL}/${provider}`;
  }

  /* Handle all generic data-oauth buttons */
  document.querySelectorAll('[data-oauth]').forEach(btn => {
    btn.addEventListener('click', () => oauthLogin(btn.dataset.oauth));
  });

  /* Also fallback IDs just in case */
  document.getElementById('ggl-login')?.addEventListener('click', () => oauthLogin('google'));
  document.getElementById('gh-login')?.addEventListener('click', () => oauthLogin('github'));
  document.getElementById('apl-login')?.addEventListener('click', () => oauthLogin('apple'));


  /* ═══════════════════════════════════════
     FORGOT PASSWORD MODAL
  ═══════════════════════════════════════ */
  const fpModal    = document.getElementById('fp-modal');
  const fpOpenBtn  = document.getElementById('fp-open-btn');
  const fpClose    = document.getElementById('fp-close');
  const fpSentClose = document.getElementById('fp-sent-close');
  const fpForm     = document.getElementById('fp-form');
  const fpBtn      = document.getElementById('fp-btn');
  const fpFormView = document.getElementById('fp-form-view');
  const fpSentView = document.getElementById('fp-sent-view');

  if (fpOpenBtn) fpOpenBtn.addEventListener('click', () => {
    fpModal.classList.add('open');
    fpSentView.style.display = 'none';
    fpFormView.style.display = 'block';
  });

  if (fpClose) fpClose.addEventListener('click', () => fpModal.classList.remove('open'));
  if (fpSentClose) fpSentClose.addEventListener('click', () => {
    fpModal.classList.remove('open');
    fpSentView.style.display = 'none';
    fpFormView.style.display = 'block';
  });

  // Close on backdrop click
  if (fpModal) {
    fpModal.addEventListener('click', (e) => {
      if (e.target === fpModal) fpModal.classList.remove('open');
    });
  }

  if (fpForm) {
    fpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('fp-email').value.trim();

      if (!email.includes('@')) return showToast('Email форматы дұрыс емес!', 'error');

      fpBtn.disabled = true;
      fpBtn.innerHTML = '<span class="spin"></span>Жіберілуде...';

      // Custom backend ақытша mock - әлi пошта жіберу сервері жоқ
      setTimeout(() => {
        fpBtn.disabled = false;
        fpBtn.innerHTML = '📩 Сілтеме жіберу';
        fpFormView.style.display = 'none';
        fpSentView.style.display = 'block';
      }, 1500);
    });
  }

});
