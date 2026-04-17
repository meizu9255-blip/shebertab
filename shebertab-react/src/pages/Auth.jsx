import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (!email.includes('@')) {
      showMessage('Қате: Email дұрыс емес!', 'error');
      return;
    }
    if (password.length < 5) {
      showMessage('Қате: Құпиясөз кем дегенде 5 таңба болуы тиіс!', 'error');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify({ name: found.name, email: found.email }));
      setUser({ name: found.name, email: found.email });
      showMessage('Жүйеге сәтті кірдіңіз!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showMessage('Қате: Email немесе пароль қате!', 'error');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // 1-шарт: Аты-жөні кемінде 6 символ болу керек
    if (name.length < 6) {
      showMessage('Қате: Аты-жөніңіз кемінде 6 символ болуы тиіс!', 'error');
      return;
    }

    // 2-шарт: Сандар жазылмау керек (Тек әріптер мен бос орын)
    if (/\d/.test(name)) {
      showMessage('Қате: Аты-жөніңізге сандар жазуға болмайды!', 'error');
      return;
    }

    if (password.length < 5) {
      showMessage('Қате: Құпиясөз кем дегенде 5 таңба болуы тиіс!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Қате: Құпиясөздер сәйкес келмейді!', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      showMessage('Қате: Бұл email тіркелген!', 'error');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Сәтті тіркелу
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    setUser({ name, email });
    showMessage('Аккаунт жасалды! Жүйеге кіріп жатырсыз...', 'success');
    e.target.reset();
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email.includes('@')) {
      showMessage('Қате: Email дұрыс емес!', 'error');
      return;
    }
    showMessage('Құпиясөзді қалпына келтіру нұсқаулығы поштаңызға жіберілді!', 'success');
    e.target.reset();
    setTimeout(() => {
      setIsForgotMode(false);
    }, 2000);
  };

  const handleSocialAlert = (provider) => {
    showMessage(`${provider} арқылы кіру жақында қосылады!`, 'success');
  };

  if (user) {
    return (
      <div className="auth-wrapper">
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: 'var(--surface)', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👤</div>
          <h2 style={{ color: 'var(--text)' }}>Сәлем, <span style={{ color: 'var(--primary)' }}>{user.name}</span>!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '30px', marginTop: '10px' }}>Жүйеге сәтті кірдіңіз ({user.email})</p>
          <button onClick={() => { localStorage.removeItem('currentUser'); setUser(null); window.location.href = '/'; }} className="btn btn-outline" style={{ borderColor: 'var(--red)', color: 'var(--red)', width: '100%', justifyContent: 'center' }}>
            🚪 Жүйеден шығу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isSignUp ? 'active' : ''}`}>
        
        {/* Register Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Тіркелу</h1>
            <div className="social-container">
              <button type="button" className="social-btn" onClick={() => handleSocialAlert('Google')} title="Google">G</button>
              <button type="button" className="social-btn" onClick={() => handleSocialAlert('Facebook')} title="Facebook">f</button>
              <button type="button" className="social-btn" onClick={() => handleSocialAlert('GitHub')} title="GitHub">gh</button>
            </div>
            <span>немесе email арқылы</span>
            <input type="text" name="name" placeholder="Аты-жөніңіз (кемінде 6 әріп)" required />
            <input type="email" name="email" placeholder="Email" required />
            
            <div className="pass-wrapper" style={{width: '100%', position: 'relative'}}>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Құпиясөз" required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            
            <div className="pass-wrapper" style={{width: '100%', position: 'relative'}}>
              <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Құпиясөзді қайталаңыз" required />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
            
            <button type="submit">Тіркелу</button>
          </form>
        </div>

        {/* Login / Forgot Password Form */}
        <div className="form-container sign-in-container">
          {!isForgotMode ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="auth-logo">Sheber<span style={{color: '#F97316'}}>Tab</span></div>
              <h1>Кіру</h1>
              <div className="social-container">
                <button type="button" className="social-btn" onClick={() => handleSocialAlert('Google')} title="Google">G</button>
                <button type="button" className="social-btn" onClick={() => handleSocialAlert('Facebook')} title="Facebook">f</button>
                <button type="button" className="social-btn" onClick={() => handleSocialAlert('GitHub')} title="GitHub">gh</button>
              </div>
              <span>немесе аккаунтыңызды қолданыңыз</span>
              <input type="email" name="email" placeholder="Email" required />
              
              <div className="pass-wrapper" style={{width: '100%', position: 'relative'}}>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Құпиясөз" required />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              
              <a href="#" className="forgot" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); }}>
                Құпиясөзді ұмыттыңыз ба?
              </a>
              <button type="submit">Кіру</button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit}>
              <div className="auth-logo">Sheber<span style={{color: '#F97316'}}>Tab</span></div>
              <h1 style={{fontSize: '1.4rem'}}>Қалпына келтіру</h1>
              <span style={{marginBottom: '20px', lineHeight: '1.5'}}>
                Теркелген Email адресіңізді жазыңыз. Біз сізге жаңа құпиясөз орнату сілтемесін жібереміз.
              </span>
              <input type="email" name="email" placeholder="Email" required />
              <button type="submit">Жіберу</button>
              <a href="#" className="forgot" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); }} style={{marginTop: '25px'}}>
                ← Артқа қайту
              </a>
            </form>
          )}
        </div>

        {/* Overlay Block for sliding animation */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Қайта оралуыңызбен!</h1>
              <p>Бізбен бірге болу үшін жеке мәліметтеріңізбен кіріңіз</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>Кіру</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Сәлем, Достым!</h1>
              <p>Мәліметтеріңізді енгізіп, бізбен бірге маман табыңыз</p>
              <button className="ghost" onClick={() => { setIsSignUp(true); setIsForgotMode(false); }}>Тіркелу</button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alert Messages */}
      {message.text && (
        <div className={`message-box ${message.type} slide-in`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Auth;
