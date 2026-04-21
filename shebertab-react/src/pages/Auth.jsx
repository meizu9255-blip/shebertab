import React, { useState, useEffect, useRef } from 'react';
import './Auth.css';

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
      canvas.width  = canvas.offsetWidth;
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
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
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

  return <canvas ref={canvasRef} className="particles-canvas" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
}

/* ═══════════════════════════════════════
   Toast Notification
═══════════════════════════════════════ */
function Toast({ toasts }) {
  return (
    <>
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
    </>
  );
}

/* ═══════════════════════════════════════
   Social Button SVGs
═══════════════════════════════════════ */
const GoogleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const GithubIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.704-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const AppleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.68zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ═══════════════════════════════════════
   Main Auth Component
═══════════════════════════════════════ */
const Auth = () => {
  const [user, setUser]               = useState(null);
  const [isSignUp, setIsSignUp]       = useState(false);
  const [showForgot, setShowForgot]   = useState(false);
  const [emailSent, setEmailSent]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [toasts, setToasts]           = useState([]);

  // Password visibility
  const [showPwLogin, setShowPwLogin]     = useState(false);
  const [showPwReg, setShowPwReg]         = useState(false);
  const [showPwConf, setShowPwConf]       = useState(false);

  // Check current auth session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
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
    const email    = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email.includes('@')) return showToast('Email форматы дұрыс емес!', 'error');
    if (password.length < 6)  return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');

    setLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/auth/login', {
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
    const name            = e.target.name.value.trim();
    const email           = e.target.email.value.trim();
    const password        = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (name.length < 6)          return showToast('Аты-жөніңіз кемінде 6 символ болуы тиіс!', 'error');
    if (/\d/.test(name))          return showToast('Аты-жөніңізге сандар жазуға болмайды!', 'error');
    if (password.length < 6)      return showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс!', 'error');
    if (password !== confirmPassword) return showToast('Құпиясөздер сәйкес келмейді!', 'error');

    setLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/auth/register', {
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
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
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
      const resp = await fetch('http://localhost:5000/api/auth/forgot-password', {
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
    const name  = user.name || user.full_name || user.email?.split('@')[0] || 'Пайдаланушы';
    const email = user.email;
    return (
      <div className="auth-page-bg" style={{ minHeight: '80vh' }}>
        <ParticlesBg />
        <div className="auth-wrapper">
          <div className="profile-glass">
            <div className="profile-avatar">👤</div>
            <div className="profile-name">{name}</div>
            <div className="profile-email">{email}</div>
            <div className="profile-badge">
              <span>✅</span> Аутентификацияланған
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Жүйеден шығу
            </button>
          </div>
        </div>
        <Toast toasts={toasts} />
      </div>
    );
  }

  /* ══════════════════════════════════════
     Main Auth UI
  ══════════════════════════════════════ */
  return (
    <div className="auth-page-bg">
      <ParticlesBg />

      <div className="auth-wrapper">
        <div className={`auth-glass-container ${isSignUp ? 'right-active' : ''}`}>

          {/* ── LEFT PANEL — Sign In ── */}
          <div className="panel-left">
            <div className="panel-title">Қош келдіңіз</div>
            <h1 className="panel-heading">Жүйеге кіру</h1>
            <p className="panel-sub">Аккаунтыңызға кіріп, маман табуды жалғастырыңыз</p>

            {/* Social Buttons */}
            <div className="social-row">
              <button className="social-btn-new google" onClick={() => handleOAuth('google')} title="Google арқылы кіру">
                <GoogleIcon /> Google
              </button>
              <button className="social-btn-new github" onClick={() => handleOAuth('github')} title="GitHub арқылы кіру">
                <GithubIcon /> GitHub
              </button>
              <button className="social-btn-new apple" onClick={() => handleOAuth('apple')} title="Apple арқылы кіру">
                <AppleIcon /> Apple
              </button>
            </div>

            <div className="or-divider">немесе email арқылы</div>

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
                  {showPwLogin ? '🙈' : '👁️'}
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

            <div className="social-row">
              <button className="social-btn-new google" onClick={() => handleOAuth('google')}>
                <GoogleIcon /> Google
              </button>
              <button className="social-btn-new github" onClick={() => handleOAuth('github')}>
                <GithubIcon /> GitHub
              </button>
              <button className="social-btn-new apple" onClick={() => handleOAuth('apple')}>
                <AppleIcon /> Apple
              </button>
            </div>

            <div className="or-divider">немесе email арқылы</div>

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
                  {showPwReg ? '🙈' : '👁️'}
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
                  {showPwConf ? '🙈' : '👁️'}
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
                  <p>Мәліметтеріңізді енгізіп,<br/>бізбен бірге маман табыңыз</p>
                  <button className="overlay-switch-btn" onClick={() => setIsSignUp(true)}>
                    Тіркелу
                  </button>
                </>
              ) : (
                <>
                  <h2>Қайта оралдыңыз! 🎉</h2>
                  <p>Бізбен бірге болу үшін жеке<br/>деректеріңізбен кіріңіз</p>
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
                    Тіркелген email адресіңізді жазыңыз.<br/>
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
