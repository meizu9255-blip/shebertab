import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Practice 2 connection - Validation
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (!email.includes('@')) {
      showMessage('Қате: Email дұрыс емес!');
      return;
    }
    if (password.length < 5) {
      showMessage('Қате: Құпиясөз тым қысқа!');
      return;
    }
    
    showMessage("Жүйеге сәтті кірдіңіз!");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    showMessage("Аккаунт жасалды! Қош келдіңіз!");
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isSignUp ? 'active' : ''}`}>
        
        {/* Register Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Тіркелу</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-google"></i> G</a>
              <a href="#" className="social"><i className="fab fa-facebook-f"></i> f</a>
            </div>
            <span>немесе email арқылы</span>
            <input type="text" placeholder="Аты-жөніңіз" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Құпиясөз" required />
            <button type="submit">Тіркелу</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-logo">Sheber<span style={{color: '#F97316'}}>Tab</span></div>
            <h1>Кіру</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-google"></i> G</a>
            </div>
            <span>немесе аккаунтыңызды қолданыңыз</span>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Құпиясөз" required />
            <a href="#" className="forgot">Құпиясөзді ұмыттыңыз ба?</a>
            <button type="submit">Кіру</button>
          </form>
        </div>

        {/* Overlay */}
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
              <button className="ghost" onClick={() => setIsSignUp(true)}>Тіркелу</button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="message-box slide-in">
          {message}
        </div>
      )}
    </div>
  );
};

export default Auth;
