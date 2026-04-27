import React, { useState, useEffect } from 'react';
import API_URL from '../config';
import { Link, useLocation } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'info'); // 'info' | 'security' | 'orders'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ratingData, setRatingData] = useState({ orderId: null, workerId: null, hoverValue: 0, value: 0 }); // State for star rating
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [servicesList, setServicesList] = useState([]); // fetched from API

  // Fetch services list on mount
  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServicesList(data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetch(`${API_URL}/api/orders/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(console.error);
    }
  }, [user, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
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
      const res = await fetch(`${API_URL}/api/auth/profile`, {
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
    if (newPassword.length < 6) return showToast('Жаңа құпиясөз кемінде 6 таңба!', 'error');

    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/auth/password`, {
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

  const handleWorkerRegistration = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    const service_id = e.target.wservice.value;
    const price_range = e.target.wprice.value;
    const average_time = e.target.wtime.value;

    try {
      const res = await fetch(`${API_URL}/api/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, service_id, price_range, average_time })
      });
      const data = await res.json();
      setSaving(false);
      
      if (!res.ok) {
        return showToast(data.error || 'Қате орын алды!', 'error');
      }
      
      showToast('Маман ретінде сәтті тіркелдіңіз!', 'success');
      e.target.reset();
      setUser({ ...user, role: 'worker' });
    } catch (err) {
      setSaving(false);
      showToast('Сервермен байланыс жоқ!', 'error');
    }
  };

  const submitRating = async (ratingValue) => {
    if (!ratingData.workerId) return;
    try {
      const res = await fetch(`${API_URL}/api/workers/${ratingData.workerId}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue, order_id: ratingData.orderId })
      });
      if (!res.ok) {
        showToast('Бағалау мүмкін емес.', 'error');
        return;
      }
      showToast('Бағаңыз қабылданды! Рахмет!', 'success');
      // Update local state to hide the button immediately
      setOrders(orders.map(o => o.id === ratingData.orderId ? { ...o, is_rated: true } : o));
      setRatingData({ orderId: null, workerId: null, hoverValue: 0, value: 0 }); // Close the rating UI
    } catch (err) {
      showToast('Бағалау мүмкін емес.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="profile-container" style={{ alignItems: 'center' }}>Жүктелуде...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">

        {/* Sidebar */}
        <aside className="profile-sidebar">
          <button className={`sidebar-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Жеке мәліметтер
          </button>
          <button className={`sidebar-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Қауіпсіздік
          </button>
          <button className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            Менің тапсырыстарым
          </button>
          <button className={`sidebar-btn ${activeTab === 'worker' ? 'active' : ''}`} onClick={() => setActiveTab('worker')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.scissors-.011c1.243.247 2.583-.024 3.67-.789m-6.01 2.14-.378 1.134a.748.748 0 0 0 .957.96l1.34-.447m0 0a2.95 2.95 0 0 0 4.162-4.163M6.75 12c0-1.864.854-3.53 2.196-4.637a4.5 4.5 0 0 1 7.08 4.636" />
            </svg>
            Маман профилі
          </button>

          <button className="sidebar-btn logout" onClick={handleLogout} style={{ marginTop: '30px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Жүйеден шығу
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
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                  <p>Сізде әзірге тапсырыстар жоқ.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {orders.map(o => {
                    // If the user is the worker on this specific order
                    const isWorker = user && user.id === o.worker_user_id;
                    // If the user is the client AND not the worker on this order
                    const isClient = user && user.id === o.client_id && !isWorker;

                    const updateStatus = async (newStatus) => {
                      try {
                        const token = localStorage.getItem('token');
                        await fetch(`${API_URL}/api/orders/${o.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ status: newStatus })
                        });
                        // Optimistically update
                        setOrders(orders.map(order => order.id === o.id ? { ...order, status: newStatus } : order));
                      } catch (err) {
                        alert('Қате орын алды');
                      }
                    };

                    return (
                    <div key={o.id} style={{ padding: '15px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>#{o.id} - {o.service_name}</span>
                        <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', background: o.status === 'pending' ? 'orange' : (o.status === 'completed' ? 'green' : (o.status === 'rejected' ? 'red' : 'blue')), color: 'white' }}>
                          {o.status === 'pending' ? 'Күтілуде' : (o.status === 'accepted' ? 'Қабылданды' : (o.status === 'completed' ? 'Аяқталды' : 'Бас тартылды'))}
                        </span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Клиент:</strong> {o.client_name} ({o.client_phone || 'Телефон көрсетілмеген'})</p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Маман:</strong> {o.worker_name}</p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Бағасы:</strong> {o.price_range}</p>
                      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Күні: {new Date(o.created_at).toLocaleString('kk-KZ')}
                      </p>
                      
                      {/* Status Buttons for Worker */}
                      {isWorker && o.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button onClick={() => updateStatus('accepted')} className="order-btn order-btn-accept">Қабылдау</button>
                          <button onClick={() => updateStatus('rejected')} className="order-btn order-btn-reject">Бас тарту</button>
                        </div>
                      )}
                      {isWorker && o.status === 'accepted' && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                          <button onClick={() => updateStatus('completed')} className="order-btn order-btn-accept">Аяқтау</button>
                          <Link to={`/messages?userId=${o.client_id}&name=${encodeURIComponent(o.client_name)}`} className="order-btn order-btn-primary">
                            <span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                              </svg>
                            </span> 
                            Чатқа өту
                          </Link>
                        </div>
                      )}

                      {/* Rating Button for Client */}
                      {isClient && o.status === 'completed' && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {!o.is_rated ? (
                            <button onClick={() => setRatingData({ orderId: o.id, workerId: o.worker_id, hoverValue: 0, value: 0 })} className="order-btn order-btn-warning">⭐ Бағалау</button>
                          ) : (
                            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold' }}>✅ Бағаланды</span>
                          )}
                          <Link to={`/messages?userId=${o.worker_user_id}&name=${encodeURIComponent(o.worker_name)}`} className="order-btn order-btn-primary">
                            <span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                              </svg>
                            </span>
                            Чатқа өту
                          </Link>
                        </div>
                      )}
                      {/* Show chat button for client if order is in progress */}
                      {isClient && o.status === 'accepted' && (
                        <div style={{ marginTop: '10px' }}>
                          <Link to={`/messages?userId=${o.worker_user_id}&name=${encodeURIComponent(o.worker_name)}`} className="order-btn order-btn-primary">
                            <span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                              </svg>
                            </span>
                            Чатқа өту
                          </Link>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}

          {activeTab === 'worker' && (
            <div>
              <h2>Маман ретінде тіркелу</h2>
              <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                Өзіңіздің қызметіңізді ұсыну үшін төмендегі форманы толтырыңыз.
              </p>
              <form onSubmit={handleWorkerRegistration}>
                <div className="profile-form-group">
                  <label htmlFor="wservice">Қызмет түрі (Service)</label>
                  <select id="wservice" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
                    <option value="">Таңдаңыз...</option>
                    {servicesList.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="wprice">Бағасы (Price Range)</label>
                  <input id="wprice" type="text" placeholder="Мысалы: 5000 ₸ - 15000 ₸" required />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="wtime">Орташа уақыт (Average Time)</label>
                  <input id="wtime" type="text" placeholder="Мысалы: 2 сағат" required />
                </div>
                <button type="submit" className="profile-submit-btn" disabled={saving}>
                  {saving ? 'Жүктелуде...' : 'Маман ретінде тіркелу'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* RATING MODAL OVERLAY */}
      {ratingData.orderId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '16px', textAlign: 'center', width: '350px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ marginBottom: '10px' }}>Маманды бағалау</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>Жұмыс сапасына 1-ден 5-ке дейін жұлдызша қойыңыз:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="40" 
                  height="40"
                  onClick={() => submitRating(star)}
                  onMouseEnter={() => setRatingData({ ...ratingData, hoverValue: star })}
                  onMouseLeave={() => setRatingData({ ...ratingData, hoverValue: 0 })}
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    fill: (ratingData.hoverValue || ratingData.value) >= star ? '#f59e0b' : '#e5e7eb',
                    transform: ratingData.hoverValue === star ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.858 1.4-8.168-5.934-5.787 8.2-1.192z"/>
                </svg>
              ))}
            </div>
            <button 
              onClick={() => setRatingData({ orderId: null, workerId: null, hoverValue: 0, value: 0 })} 
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: '600' }}
            >
              Бас тарту
            </button>
          </div>
        </div>
      )}

      {/* Embedded Toasts */}
      <div className="auth-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`auth-toast ${t.type} ${t.hiding ? 'hiding' : 'show'}`} style={{ position: 'fixed', bottom: 20, right: 20 }}>
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
