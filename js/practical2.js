// ═══════════════════════════════════════════════════════
//  practical2.js — 6 JavaScript тапсырма
// ═══════════════════════════════════════════════════════

// ── TASK 1: Батырма + Фон ──
let readMore = false;
const readMoreBtn = document.getElementById('btn-read-more');
const t1Text      = document.getElementById('t1-text');
const t1Extra     = document.getElementById('t1-extra');

if (readMoreBtn) {
  readMoreBtn.addEventListener('click', () => {
    readMore = !readMore;
    if (readMore) {
      t1Extra.style.display = 'block';
      t1Text.textContent    = '📚 Толық мәтін жүктелді!';
      t1Text.style.color    = '#10B981';
      readMoreBtn.textContent = '📕 Жасыру';
    } else {
      t1Extra.style.display = 'none';
      t1Text.textContent    = '👈 Батырмаларды басып көріңіз!';
      t1Text.style.color    = '';
      readMoreBtn.textContent = '📖 Көбірек оқу';
    }
  });
}

const bgColors = ['#F2FBFC','#FFF7F0','#F0FFF4','#FFF0F5','#F5F0FF','#FFFBEB'];
let bgIdx = 0;
const bgBtn = document.getElementById('btn-bg-change');
if (bgBtn) {
  bgBtn.addEventListener('click', () => {
    bgIdx = (bgIdx + 1) % bgColors.length;
    document.body.style.background = bgColors[bgIdx];
    document.body.style.transition = 'background 0.5s ease';
    bgBtn.textContent = `🎨 Фон ${bgIdx + 1}/${bgColors.length}`;
  });
}

// ── TASK 2: Форма Validation ──
const t2Submit = document.getElementById('btn-t2-submit');
if (t2Submit) {
  t2Submit.addEventListener('click', () => {
    const name  = document.getElementById('t2-name').value.trim();
    const email = document.getElementById('t2-email').value.trim();
    const box   = document.getElementById('t2-result');
    const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      showBox(box, '❌ Қате: Атыңызды енгізіңіз!', 'error');
    } else if (!email || !re.test(email)) {
      showBox(box, '❌ Қате: Дұрыс email форматын енгізіңіз!', 'error');
    } else {
      showBox(box, `✅ Сәтті! Аты: ${name} | Email: ${email}`, 'success');
    }
  });
}

function showBox(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className   = `alert ${type} show`;
}

// ── TASK 3: DOM — элемент қосу/жою ──
const t3Add    = document.getElementById('btn-t3-add');
const t3Remove = document.getElementById('btn-t3-remove');
const t3Input  = document.getElementById('t3-input');
const t3List   = document.getElementById('t3-list');

if (t3Add) {
  t3Add.addEventListener('click', () => {
    const val = t3Input.value.trim();
    if (!val) { t3Input.focus(); return; }
    const li = document.createElement('li');
    li.innerHTML = `<span>👷 ${val}</span><button class="del-btn" onclick="this.parentElement.remove()">✕</button>`;
    t3List.appendChild(li);
    t3Input.value = ''; t3Input.focus();
  });
}
if (t3Remove) {
  t3Remove.addEventListener('click', () => {
    if (t3List && t3List.lastElementChild) t3List.lastElementChild.remove();
  });
}
if (t3Input) {
  t3Input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && t3Add) t3Add.click();
  });
}

// ── TASK 4: Көрсету / Жасыру ──
const t4Btn = document.getElementById('btn-t4-toggle');
const t4Con = document.getElementById('t4-content');

if (t4Btn && t4Con) {
  let t4open = true;
  t4Btn.classList.add('open');
  t4Btn.addEventListener('click', () => {
    t4open = !t4open;
    t4Con.classList.toggle('hidden', !t4open);
    t4Btn.classList.toggle('open', t4open);
  });
}

// ── TASK 5: setInterval — Санауыш ──
let secs = 0, timer = null, running = false;
const disp = document.getElementById('t5-display');
const msg5 = document.getElementById('t5-message');

function fmt(s) {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(v => String(v).padStart(2, '0')).join(':');
}

const t5Start = document.getElementById('t5-start');
const t5Pause = document.getElementById('t5-pause');
const t5Reset = document.getElementById('t5-reset');

if (t5Start) {
  t5Start.addEventListener('click', () => {
    if (running) return;
    running = true;
    if (disp) disp.className = 'running';
    if (msg5) msg5.textContent = '⏱️ Санауыш жұмыс істеуде...';
    timer = setInterval(() => {
      secs++;
      if (disp) disp.textContent = fmt(secs);
    }, 1000);
  });
}
if (t5Pause) {
  t5Pause.addEventListener('click', () => {
    if (!running) return;
    clearInterval(timer); running = false;
    if (disp) disp.className = 'paused';
    if (msg5) msg5.textContent = '⏸️ Тоқтатылды. Жалғастыру үшін ▶ басыңыз.';
  });
}
if (t5Reset) {
  t5Reset.addEventListener('click', () => {
    clearInterval(timer); running = false; secs = 0;
    if (disp) { disp.textContent = '00:00:00'; disp.className = ''; }
    if (msg5) msg5.textContent = 'Санауышты іске қосыңыз!';
  });
}

// ── TASK 6: classList toggle ──
function toggleCls(cls, btn) {
  const box = document.getElementById('t6-box');
  if (box) box.classList.toggle(cls);
  if (btn) btn.classList.toggle('active');
}
window.toggleCls = toggleCls;
