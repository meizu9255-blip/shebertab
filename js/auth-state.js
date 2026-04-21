/* ═══════════════════════════════════════════════════════════
   SheberTab — Auth State (Vanilla, Custom Backend)
   Updates all pages: Navbar user display, auth-aware redirects
═══════════════════════════════════════════════════════════ */

const BACKEND_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', async () => {

  const ctaLabels = document.querySelectorAll('.fez-cta-label');
  const ctaLinks  = document.querySelectorAll('.fez-cta-link');

  function updateNavbarUI(user) {
    if (user) {
      const displayName = user.name?.split(' ')[0] 
                       || user.full_name?.split(' ')[0] 
                       || user.email?.split('@')[0] 
                       || 'Пайдаланушы';
      ctaLabels.forEach(el => { el.textContent = '👤 ' + displayName; });

      /* Convert CTA link to logout button */
      ctaLinks.forEach(link => {
        if (link.tagName === 'A') {
          const btn = document.createElement('button');
          btn.className = link.className;
          btn.style.cssText = 'background:none;border:none;cursor:pointer;font-family:inherit;';
          btn.title = 'Жүйеден шығу';
          btn.innerHTML = link.innerHTML;
          btn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
          });
          link.replaceWith(btn);
        }
      });
    } else {
      ctaLabels.forEach(el => { el.textContent = 'Кіру / Тіркелу'; });
    }
  }

  /* ─── Handle OAuth Redirection logic (if ?token= is in URL) ─── */
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  if (urlToken) {
    localStorage.setItem('token', urlToken);
    // Remove token from url cleanly
    if (window.history.replaceState) {
       window.history.replaceState(null, '', window.location.pathname);
    }
  }

  /* ─── Get current session from LocalStorage / Backend ─── */
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch(`${BACKEND_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateNavbarUI(data.user);
      } else {
        localStorage.removeItem('token');
        updateNavbarUI(null);
      }
    } catch (err) {
      console.error('Navbar backend fetch error:', err);
    }
  } else {
    updateNavbarUI(null);
  }

  /* ─── Handle ?mode=register on login page ─── */
  if (window.location.search.includes('mode=register')) {
    const glassBox  = document.getElementById('glass-box');
    const ovlLogin  = document.getElementById('ovl-login-text');
    const ovlReg    = document.getElementById('ovl-reg-text');
    if (glassBox) {
      glassBox.classList.add('reg-mode');
      if (ovlLogin) ovlLogin.style.display = 'none';
      if (ovlReg)   ovlReg.style.display   = 'block';
    }
  }
});
