import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'orders'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }

    fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        setName(data.user.name || data.user.full_name || '');
        setEmail(data.user.email || '');
      } else {
        window.location.href = '/auth';
      }
    })
    .catch(err => {
      console.error(err);
      window.location.href = '/auth';
    })
    .finally(() => setLoading(false));
  }, []);

  const showToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type, hiding: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 4000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      setSaving(false);
      
      if (!res.ok) {
        return showToast(data.error || 'Қате орын алды!', 'error');
      }

      localStorage.setItem('token', data.token); // update token
      setUser(data.user);
      showToast('Мәліметтер сәтті сақталды!', 'success');
      // Update UI across tabs
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaving(false);
      showToast('Сервермен байланыс жоқ!', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if(newPassword.length < 6) return showToast('Жаңа құпиясөз кемінде 6 таңба!', 'error');
    
    setSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      setSaving(false);
      
      if (!res.ok) {
        return showToast(data.error || 'Құпиясөз өзгермеді!', 'error');
      }

      showToast('Құпиясөз сәтті өзгертілді!', 'success');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setSaving(false);
      showToast('Сервермен байланыс жоқ!', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="profile-container" style={{alignItems:'center'}}>Жүктелуде...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <button className={`sidebar-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            👤 Жеке мәліметтер
          </button>
          <button className={`sidebar-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            🔒 Қауіпсіздік
          </button>
          <button className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📋 Менің тапсырыстарым
          </button>
          
          <button className="sidebar-btn logout" onClick={handleLogout} style={{marginTop: '30px'}}>
            🚪 Жүйеден шығу
          </button>
        </aside>

        {/* Content */}
        <main className="profile-content">
          {activeTab === 'info' && (
            <div>
              <h2>Жеке мәліметтер</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="profile-form-group">
                  <label htmlFor="pname">Аты-жөніңіз</label>
                  <input id="pname" type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="pemail">Email адресіңіз</label>
                  <input id="pemail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="profile-submit-btn" disabled={saving}>
                  {saving ? 'Сақталуда...' : 'Өзгерістерді сақтау'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2>Қауіпсіздік</h2>
              <form onSubmit={handleChangePassword}>
                <div className="profile-form-group">
                  <label htmlFor="oldpw">Кәзіргі құпиясөз</label>
                  <input id="oldpw" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="newpw">Жаңа құпиясөз</label>
                  <input id="newpw" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit" className="profile-submit-btn" disabled={saving}>
                  {saving ? 'Сақталуда...' : 'Құпиясөзді жаңарту'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Менің тапсырыстарым</h2>
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                <p>Сізде әзірге тапсырыстар жоқ.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Embedded Toasts */}
      <div className="auth-toasts">
      {toasts.map(t => (
        <div key={t.id} className={`auth-toast ${t.type} ${t.hiding ? 'hiding' : 'show'}`} style={{position: 'fixed', bottom: 20, right: 20}}>
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

    </div>
  );
};

export default Profile;
