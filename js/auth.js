// ═══════════════════════════════════════════════════════
//  auth.js — Lamp Animation + Register/Login Logic
//  Tasks: 7 (Register), 8 (Login), 9 (Auth State)
// ═══════════════════════════════════════════════════════

/* ─── Lamp Physics ─── */
const ropeHandle    = document.getElementById('ropeHandle');
const pullRope      = document.getElementById('pullRope');
const lampContainer = document.querySelector('.lamp-container');
const authContainer = document.querySelector('.auth-container');

let isDragging = false, startY = 0, pull = 0, velocity = 0;
let lampOn = false, hasTriggered = false;
const MAX_PULL = 140, SPRING = 0.08, DAMP = 0.88, SWING_K = 0.15;
let swingAngle = 0, swingVelocity = 0;

if (ropeHandle) {
  ropeHandle.addEventListener('mousedown', startDrag);
  ropeHandle.addEventListener('touchstart', startDrag, { passive: false });
}

function startDrag(e) {
  e.preventDefault();
  isDragging = true; hasTriggered = false;
  startY = getClientY(e);
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup',  stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  const delta = getClientY(e) - startY;
  pull = Math.max(0, Math.min(MAX_PULL, delta));
  if (pull > 78 && !hasTriggered) {
    lampOn = !lampOn;
    hasTriggered = true;
    applyLampState();
  }
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup',  stopDrag);
  document.removeEventListener('touchend', stopDrag);
}

function getClientY(e) {
  return e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
}

function animateRope() {
  if (!isDragging) {
    velocity += -pull * SPRING;
    velocity *= DAMP;
    pull += velocity;
    if (Math.abs(pull) < 0.2) { pull = 0; velocity = 0; }
  }
  swingVelocity += -swingAngle * 0.05;
  swingVelocity *= 0.9;
  swingAngle += swingVelocity + velocity * SWING_K;

  const baseH = 90, rTop = 130;
  if (pullRope)    pullRope.style.height    = (baseH + pull) + 'px';
  if (pullRope)    pullRope.style.transform = `rotate(${swingAngle * 0.2}deg)`;
  if (ropeHandle)  ropeHandle.style.top     = (rTop + baseH + pull - 12) + 'px';
  if (ropeHandle)  ropeHandle.style.transform = `rotate(${swingAngle}deg)`;

  requestAnimationFrame(animateRope);
}
animateRope();

/* ─── Auth Helpers (Task 9) ─── */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('stt_current') || 'null');
}

function applyLampState() {
  if (lampOn) {
    authContainer && authContainer.classList.add('lamp-on');
    showCorrectPanel();
  } else {
    authContainer && authContainer.classList.remove('lamp-on');
    hideAllPanels();
  }
}

function hideAllPanels() {
  document.querySelectorAll('.auth-card, .user-panel, .success-panel').forEach(el => {
    el.classList.remove('visible');
    el.classList.add('hidden');
  });
}

function showCorrectPanel() {
  // Implemented per-page below
  if (typeof onLampOn === 'function') onLampOn();
}

// Auto-on if already logged in
window.addEventListener('DOMContentLoaded', () => {
  if (getCurrentUser()) {
    lampOn = true;
    authContainer && authContainer.classList.add('lamp-on');
    showCorrectPanel();
  }
});

/* ══════════════════════════════════════
   LOGIN PAGE (Tasks 8 & 9)
══════════════════════════════════════ */
const loginCard   = document.getElementById('loginCard');
const userPanel   = document.getElementById('userPanel');
const loginFormEl = document.getElementById('loginFormEl');
const loginAlert  = document.getElementById('loginAlert');

// Task 9 — show panel
function onLampOn() {
  const user = getCurrentUser();
  if (user) {
    hideAllPanels();
    if (userPanel) {
      userPanel.style.display = 'block';
      requestAnimationFrame(() => {
        userPanel.classList.remove('hidden');
        userPanel.classList.add('visible');
      });
    }
    const wName  = document.getElementById('welcomeName');
    const wEmail = document.getElementById('welcomeEmail');
    if (wName)  wName.textContent  = user.name;
    if (wEmail) wEmail.textContent = user.email;
  } else {
    if (loginCard) {
      loginCard.classList.remove('hidden');
      loginCard.classList.add('visible');
    }
  }
}
window.onLampOn = onLampOn;

// Task 9 — Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('stt_current');
    if (userPanel) { userPanel.classList.remove('visible'); userPanel.classList.add('hidden'); }
    setTimeout(() => {
      if (loginCard) { loginCard.classList.remove('hidden'); loginCard.classList.add('visible'); }
    }, 120);
  });
}

// Task 8 — Login form validation
function clearFieldErr(inputId, errId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.addEventListener('input', () => {
    inp.classList.remove('err');
    if (err) err.classList.remove('show');
  });
}
clearFieldErr('loginEmail',    'errLoginEmail');
clearFieldErr('loginPassword', 'errLoginPass');

if (loginFormEl) {
  loginFormEl.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = document.getElementById('loginEmail');
    const passEl  = document.getElementById('loginPassword');
    const email   = emailEl ? emailEl.value.trim() : '';
    const pass    = passEl  ? passEl.value          : '';
    let ok = true;

    if (!email) {
      emailEl.classList.add('err');
      document.getElementById('errLoginEmail').classList.add('show');
      ok = false;
    }
    if (!pass) {
      passEl.classList.add('err');
      document.getElementById('errLoginPass').classList.add('show');
      ok = false;
    }
    if (!ok) return;

    const users = JSON.parse(localStorage.getItem('stt_users') || '[]');
    const found = users.find(u => u.email === email && u.password === pass);

    if (found) {
      localStorage.setItem('stt_current', JSON.stringify({ name: found.name, email: found.email }));
      showAlert(loginAlert, '✅ Сәтті кірдіңіз!', 'success');
      setTimeout(() => {
        loginAlert.className = 'alert';
        onLampOn();
      }, 1100);
    } else {
      showAlert(loginAlert, '❌ Email немесе пароль қате', 'error');
      if (loginCard) {
        loginCard.classList.add('shake');
        setTimeout(() => loginCard.classList.remove('shake'), 400);
      }
    }
  });
}

/* ══════════════════════════════════════
   REGISTER PAGE (Task 7)
══════════════════════════════════════ */
const regCard      = document.getElementById('regCard');
const successPanel = document.getElementById('successPanel');
const regAlert     = document.getElementById('regAlert');
const regFormEl    = document.getElementById('regFormEl');

// Re-use onLampOn for register page
if (regCard && !loginCard) {
  window.onLampOn = function () {
    if (successPanel && successPanel.classList.contains('visible')) return;
    hideAllPanels();
    if (regCard) {
      regCard.style.display = 'block';
      setTimeout(() => {
        regCard.classList.remove('hidden');
        regCard.classList.add('visible');
      }, 20);
    }
  };
}

// Password strength
const regPassEl = document.getElementById('regPass');
if (regPassEl) {
  regPassEl.addEventListener('input', function () {
    const v = this.value;
    let s = 0;
    if (v.length >= 6)          s++;
    if (v.length >= 10)         s++;
    if (/[A-Z]/.test(v))        s++;
    if (/[0-9]/.test(v))        s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const levels = [
      { w: '0%',   c: '#CBD5E1', t: 'Парольдің күші' },
      { w: '20%',  c: '#EF4444', t: '🔴 Өте әлсіз' },
      { w: '40%',  c: '#F97316', t: '🟠 Әлсіз' },
      { w: '60%',  c: '#EAB308', t: '🟡 Орташа' },
      { w: '80%',  c: '#06B6D4', t: '🔵 Күшті' },
      { w: '100%', c: '#10B981', t: '🟢 Өте күшті' },
    ];
    const lvl = v.length === 0 ? 0 : Math.min(s, 5);
    const fill  = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (fill)  { fill.style.width = levels[lvl].w; fill.style.background = levels[lvl].c; }
    if (label) label.textContent = levels[lvl].t;
  });
}

// Clear errors on input
['regName', 'regEmail', 'regPass'].forEach((id, i) => {
  const errIds = ['errName', 'errEmail', 'errPass'];
  const el = document.getElementById(id);
  const er = document.getElementById(errIds[i]);
  if (el && er) {
    el.addEventListener('input', () => {
      el.classList.remove('err');
      er.classList.remove('show');
    });
  }
});

// Register submit (Task 7)
if (regFormEl) {
  regFormEl.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPass').value;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;

    if (!name)                   { setFieldErr('regName',  'errName',  'Атыңызды енгізіңіз');            ok = false; }
    if (!email||!emailRe.test(email)) { setFieldErr('regEmail', 'errEmail', 'Дұрыс email енгізіңіз');   ok = false; }
    if (pass.length < 6)         { setFieldErr('regPass',  'errPass',  'Кемінде 6 символ болуы керек'); ok = false; }
    if (!ok) { showAlert(regAlert, '❌ Барлық өрістерді дұрыс толтырыңыз!', 'error'); return; }

    const users = JSON.parse(localStorage.getItem('stt_users') || '[]');
    if (users.find(u => u.email === email)) {
      setFieldErr('regEmail', 'errEmail', 'Бұл email тіркелген!');
      showAlert(regAlert, '❌ Бұл email жүйеде бар.', 'error');
      return;
    }

    users.push({ name, email, password: pass });
    localStorage.setItem('stt_users',   JSON.stringify(users));
    localStorage.setItem('stt_current', JSON.stringify({ name, email }));

    regCard.classList.remove('visible'); regCard.classList.add('hidden');
    setTimeout(() => {
      if (successPanel) {
        successPanel.style.display = 'block';
        requestAnimationFrame(() => successPanel.classList.add('visible'));
      }
    }, 320);
  });
}

/* ─── Utility ─── */
function setFieldErr(inputId, errId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.classList.add('err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function showAlert(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className   = `alert ${type} show`;
}
