import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OAuth redirect handler.
 * Node.js backend OAuth providers redirect back here with a JWT token.
 * This page reads the token from URL query params and redirects to home.
 */
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL-ден token-ді оқу (мысалы: ?token=eyJh...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // 2. Token бар болса, сақтау
      localStorage.setItem('token', token);
      
      // 3. Басты бетке бағыттау
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      // Басқа жағдайда login бетіне қайтару
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0e1a', color: '#fff' }}>
      <div className="spinner" style={{
        width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'sp 1s linear infinite', marginBottom: '20px'
      }} />
      <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600 }}>Аутентификация аяқталуда...</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Күте тұрыңыз, сізді басты бетке бағыттаймыз.</p>
    </div>
  );
}

export default AuthCallback;
