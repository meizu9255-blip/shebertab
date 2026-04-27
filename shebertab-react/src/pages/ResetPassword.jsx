import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

/* ── Particles Background (Reused for consistency) ── */
function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
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

  return <canvas ref={canvasRef} className="particles-canvas" style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex: 1, opacity: 0.6 }} />;
}

/* ── Toast Component ── */
function Toast({ toasts }) {
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
        </div>
      ))}
    </div>
  );
}

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Password hide/show toggles
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const showToast = (text, type = 'success') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, text, type, hiding: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toastId ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 350);
    }, 4000);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const pw1 = e.target.newPassword.value;
    const pw2 = e.target.confirmPassword.value;

    if (pw1.length < 6) return showToast('Құпиясөз тым қысқа (кемінде 6 таңба)', 'error');
    if (pw1 !== pw2) return showToast('Құпиясөздер сәйкес келмейді!', 'error');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/reset-password/${id}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw1 })
      });
      
      const data = await resp.json();
      setLoading(false);

      if (!resp.ok) {
        return showToast(data.error || 'Қате орын алды!', 'error');
      }

      setSuccess(true);
    } catch (error) {
      setLoading(false);
      showToast('Серверге қосылу мүмкін болмады', 'error');
    }
  };

  return (
    <div className="reset-page-bg">
      <ParticlesBg />
      <div className="reset-wrapper">
        <div className="reset-glass-container">
          {!success ? (
            <>
              <div className="reset-icon">🔐</div>
              <h1 className="reset-heading">Жаңа құпиясөз</h1>
              <p className="reset-sub">Ескі құпиясөзді ұмытсаңыз, мәселе емес. Қауіпсіз жаңа құпиясөз орнатыңыз.</p>

              <form onSubmit={handleReset}>
                <div className="reset-group">
                  <input 
                    type={showPw1 ? 'text' : 'password'} 
                    id="rp-pw1" name="newPassword" 
                    placeholder="Жаңа құпиясөз" required 
                  />
                  <label htmlFor="rp-pw1">Жаңа құпиясөз</label>
                  <span className="reset-float-icon">🔑</span>
                  <button type="button" className="reset-eye" onClick={() => setShowPw1(v => !v)}>{showPw1 ? '🙈' : '👁️'}</button>
                </div>

                <div className="reset-group">
                  <input 
                    type={showPw2 ? 'text' : 'password'} 
                    id="rp-pw2" name="confirmPassword" 
                    placeholder="Құпиясөзді қайталаңыз" required 
                  />
                  <label htmlFor="rp-pw2">Құпиясөзді қайталаңыз</label>
                  <span className="reset-float-icon">🔒</span>
                  <button type="button" className="reset-eye" onClick={() => setShowPw2(v => !v)}>{showPw2 ? '🙈' : '👁️'}</button>
                </div>

                <button type="submit" className="reset-submit-btn" disabled={loading}>
                  {loading ? <><span className="reset-spinner"/>Сақталуда...</> : 'Құпиясөзді сақтау'}
                </button>
              </form>
            </>
          ) : (
             <div className="reset-success-state">
               <span className="reset-success-icon">🎉</span>
               <h3>Құпиясөз жаңартылды!</h3>
               <p>Құпиясөзіңіз сәтті өзгертілді. Енді жаңа мәліметтермен жүйеге кіре аласыз.</p>
               <button className="reset-submit-btn" onClick={() => navigate('/auth')}>
                 Кіру бетіне өту →
               </button>
             </div>
          )}
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
};

export default ResetPassword;
