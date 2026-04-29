import React, { useState, useEffect, useRef } from 'react';
import './Auth.css';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════
   Particle Background Component
═══════════════════════════════════════ */
function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      // draw faint connecting lines
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
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ═══════════════════════════════════════
   Toast Notification
═══════════════════════════════════════ */
function Toast({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="auth-toasts">
      {toasts.map(t => (
        <div key={t.id} className={`auth-toast ${t.type} ${t.hiding ? 'hiding' : 'show'}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <div className="toast-body">
            <div className="toast-title">{t.type === 'success' ? 'Сәтті!' : t.type === 'error' ? 'Қате!' : 'Ақпарат'}</div>
            <div className="toast-msg">{t.text}</div>
          </div>
          <div className="toast-bar" />
        </div>
      ))}
    </div>
  );
}



const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

/* ═══════════════════════════════════════
   Main Auth Component
═══════════════════════════════════════ */
const Auth = () => {
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [serverWaking, setServerWaking] = useState(false);

  // Password visibility
  const [showPwLogin, setShowPwLogin] = useState(false);
  const [showPwReg, setShowPwReg] = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);

  // Check current auth session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(err => {
          console.error('Auth verification error:', err);
          localStorage.removeItem('token');
        });
    }

    // Render cold-start: ping backend to wake it up
    setServerWaking(true);
    fetch(`${API_URL}/`)
      .then(() => setServerWaking(false))
      .catch(() => setServerWaking(false));
  }, []);

  /* ── Toast helper ── */
  const showToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type, hiding: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 4000);
  };

  /* ══════════════════════════════════════
     LOGIN with Email/Password
  ══════════════════════════════════════ */
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email.includes('@')) return showToast('Email форматы дұрыс емес!', 'error');
    if (password.length < 6) return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      setLoading(false);

      if (!resp.ok) {
        return showToast(data.error || 'Email немесе пароль қате!', 'error');
      }

      localStorage.setItem('token', data.token);
      showToast('Жүйеге сәтті кірдіңіз!', 'success');
      setTimeout(() => { window.location.href = '/'; }, 1200);
    } catch (err) {
      setLoading(false);
      showToast('Сервермен байланыс жоқ!', 'error');
    }
  };

  /* ══════════════════════════════════════
     REGISTER with Email/Password
  ══════════════════════════════════════ */
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (name.length < 6) return showToast('Аты-жөніңіз кемінде 6 символ болуы тиіс!', 'error');
    if (/\d/.test(name)) return showToast('Аты-жөніңізге сандар жазуға болмайды!', 'error');
    if (password.length < 6) return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');
    if (password !== confirmPassword) return showToast('Құпиясөздер сәйкес келмейді!', 'error');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await resp.json();
      setLoading(false);

      if (!resp.ok) {
        return showToast(data.error || 'Тіркелу кезінде қате орын алды!', 'error');
      }

      localStorage.setItem('token', data.token);
      showToast('Аккаунт жасалды! Жүйеге кірдіңіз.', 'success');
      e.target.reset();
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setLoading(false);
      showToast('Сервермен байланыс орнату мүмкін емес!', 'error');
    }
  };

  /* ══════════════════════════════════════
     OAuth — Google / GitHub / Apple
  ══════════════════════════════════════ */
  const handleOAuth = (provider) => {
    // Backend API арқылы OAuth бастау
    window.location.href = `${API_URL}/api/auth/${provider}`;
  };

  /* ══════════════════════════════════════
     FORGOT PASSWORD
  ══════════════════════════════════════ */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email.includes('@')) return showToast('Email форматы дұрыс емес!', 'error');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();
      setLoading(false);

      if (!resp.ok) {
        return showToast(data.error || 'Қате орын алды!', 'error');
      }

      setEmailSent(true);
    } catch (err) {
      setLoading(false);
      showToast('Сервермен байланысу мүмкін болмады!', 'error');
    }
  };

  /* ══════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════ */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Жүйеден сәтті шықтыңыз!', 'info');
    setTimeout(() => { window.location.href = '/'; }, 800);
  };

  /* ══════════════════════════════════════
     Profile Panel (if logged in)
  ══════════════════════════════════════ */
  if (user) {
    window.location.href = '/profile';
    return null;
  }

  /* ══════════════════════════════════════
     Main Auth UI
  ══════════════════════════════════════ */
  return (
    <div className="auth-page-bg">
      <ParticlesBg />

      {/* Render cold-start banner */}
      {serverWaking && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'linear-gradient(90deg, #f59e0b, #f97316)',
          color: '#fff', textAlign: 'center', padding: '10px 16px',
          fontSize: '14px', fontWeight: 500, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
          Сервер іске қосылуда, 20–30 секунд күтіңіз...
        </div>
      )}

      <div className="auth-wrapper">
        <div className={`auth-glass-container ${isSignUp ? 'right-active' : ''}`}>

          {/* ── LEFT PANEL — Sign In ── */}
          <div className="panel-left">
            <div className="panel-title">Қош келдіңіз</div>
            <h1 className="panel-heading">Жүйеге кіру</h1>
            <p className="panel-sub">Аккаунтыңызға кіріп, маман табуды жалғастырыңыз</p>


            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="float-group">
                <input type="email" id="li-email" name="email" placeholder="Email" required />
                <label htmlFor="li-email">Email</label>
                <span className="float-icon">✉️</span>
              </div>

              {/* Password */}
              <div className="float-group">
                <input
                  type={showPwLogin ? 'text' : 'password'}
                  id="li-pw" name="password"
                  placeholder="Құпиясөз" required
                />
                <label htmlFor="li-pw">Құпиясөз</label>
                <span className="float-icon">🔒</span>
                <button type="button" className="eye-toggle" onClick={() => setShowPwLogin(v => !v)}>
                  {showPwLogin ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <span className="forgot-link" onClick={() => { setShowForgot(true); setEmailSent(false); }}>
                Құпиясөзді ұмыттыңыз ба?
              </span>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <><span className="btn-spinner" />Кіріп жатыр...</> : 'Кіру →'}
              </button>
            </form>
          </div>

          {/* ── RIGHT PANEL — Sign Up ── */}
          <div className="panel-right">
            <div className="panel-title">Жаңа аккаунт</div>
            <h1 className="panel-heading">Тіркелу</h1>
            <p className="panel-sub">Бізбен бірге болып, кәсіпқой маман табыңыз</p>


            <form onSubmit={handleRegister}>
              {/* Name */}
              <div className="float-group">
                <input type="text" id="ru-name" name="name" placeholder="Аты-жөніңіз" required />
                <label htmlFor="ru-name">Аты-жөніңіз</label>
                <span className="float-icon">👤</span>
              </div>

              {/* Email */}
              <div className="float-group">
                <input type="email" id="ru-email" name="email" placeholder="Email" required />
                <label htmlFor="ru-email">Email</label>
                <span className="float-icon">✉️</span>
              </div>

              {/* Password */}
              <div className="float-group">
                <input
                  type={showPwReg ? 'text' : 'password'}
                  id="ru-pw" name="password"
                  placeholder="Құпиясөз" required
                />
                <label htmlFor="ru-pw">Құпиясөз</label>
                <span className="float-icon">🔒</span>
                <button type="button" className="eye-toggle" onClick={() => setShowPwReg(v => !v)}>
                  {showPwReg ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="float-group">
                <input
                  type={showPwConf ? 'text' : 'password'}
                  id="ru-conf" name="confirmPassword"
                  placeholder="Қайталаңыз" required
                />
                <label htmlFor="ru-conf">Құпиясөзді қайталаңыз</label>
                <span className="float-icon">🔐</span>
                <button type="button" className="eye-toggle" onClick={() => setShowPwConf(v => !v)}>
                  {showPwConf ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <><span className="btn-spinner" />Тіркеліп жатыр...</> : 'Тіркелу →'}
              </button>
            </form>
          </div>

          {/* ── OVERLAY SLIDE ── */}
          <div className="overlay-slide">
            <div className="overlay-content">
              <div className="overlay-logo">
                Sheber<span className="o-tab">Tab</span>
              </div>
              {!isSignUp ? (
                <>
                  <h2>Сәлем, Достым! 👋</h2>
                  <p>Мәліметтеріңізді енгізіп,<br />бізбен бірге маман табыңыз</p>
                  <button className="overlay-switch-btn" onClick={() => setIsSignUp(true)}>
                    Тіркелу
                  </button>
                </>
              ) : (
                <>
                  <h2>Қайта оралдыңыз! 🎉</h2>
                  <p>Бізбен бірге болу үшін жеке<br />деректеріңізбен кіріңіз</p>
                  <button className="overlay-switch-btn" onClick={() => setIsSignUp(false)}>
                    Кіру
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── FORGOT PASSWORD PANEL ── */}
          <div className={`forgot-panel ${showForgot ? 'open' : ''}`}>
            <div className="forgot-card">
              {!emailSent ? (
                <>
                  <div className="forgot-icon">🔑</div>
                  <h2>Құпиясөзді қалпына келтіру</h2>
                  <p>
                    Тіркелген email адресіңізді жазыңыз.<br />
                    Біз сізге парольді қалпына келтіру сілтемесін жібереміз.
                  </p>
                  <form onSubmit={handleForgotPassword}>
                    <div className="float-group" style={{ marginBottom: '20px' }}>
                      <input type="email" id="fp-email" name="email" placeholder="Email" required />
                      <label htmlFor="fp-email">Email адресіңіз</label>
                      <span className="float-icon">✉️</span>
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                      {loading ? <><span className="btn-spinner" />Жіберілуде...</> : '📩 Сілтеме жіберу'}
                    </button>
                  </form>
                  <button className="forgot-back" onClick={() => setShowForgot(false)}>
                    ← Артқа қайту
                  </button>
                </>
              ) : (
                <div className="sent-state">
                  <span className="sent-icon">📬</span>
                  <h3>Поштаңызды тексеріңіз!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.87rem', lineHeight: 1.7 }}>
                    Парольді қалпына келтіру сілтемесі email адресіңізге жіберілді. Inbox немесе Spam папкасын тексеріңіз.
                  </p>
                  <button className="forgot-back" style={{ marginTop: 24 }} onClick={() => { setShowForgot(false); setEmailSent(false); }}>
                    ← Кіру бетіне оралу
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>{/* auth-glass-container */}
      </div>{/* auth-wrapper */}

      <Toast toasts={toasts} />
    </div>
  );
};

export default Auth;
