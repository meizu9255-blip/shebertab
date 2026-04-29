import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Navbar.css';
import DarkToggle from './DarkToggle';

const Navbar = ({ darkMode, onToggleDark }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const socketRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Wake up Render backend on load
  useEffect(() => {
    fetch(`${API_URL}/`).catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (!data.user) { localStorage.removeItem('token'); return; }
      setUser(data.user);

      fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(notifs => { if (Array.isArray(notifs)) setNotifications(notifs); });

      const socket = io(API_URL, { autoConnect: true });
      socketRef.current = socket;
      socket.emit('join', data.user.id);
      socket.off('new_notification');
      socket.on('new_notification', (notif) => {
        setNotifications(prev => {
          if (prev.some(n => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
      });
    })
    .catch(() => { localStorage.removeItem('token'); });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_notification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Desktop nav items
  const navItems = [
    {
      to: '/', end: true, label: 'Басты',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>,
    },
    {
      to: '/about', label: 'Туралы',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>,
    },
    {
      to: '/services', label: 'Қызметтер',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="m706-136-75-75 51-51-106-106-51 51-75-75 51-51-85-85-51 51-75-75 199-199q14-14 34-14t34 14l75 75 50-51q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T838-633l-51 50 75 75q14 14 14 34t-14 34L706-136Z"/></svg>,
    },
    {
      to: '/blog', label: 'Блог',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-221q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Z"/></svg>,
    },
    {
      to: '/contact', label: 'Байланыс',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>,
    },
  ];

  // Mobile bottom nav items (condensed)
  const mobileNavItems = [
    {
      to: '/', end: true, label: 'Басты',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>,
    },
    {
      to: '/services', label: 'Қызмет',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="m706-136-75-75 51-51-106-106-51 51-75-75 51-51-85-85-51 51-75-75 199-199q14-14 34-14t34 14l75 75 50-51q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T838-633l-51 50 75 75q14 14 14 34t-14 34L706-136Z"/></svg>,
    },
    ...(user ? [{
      to: '/messages', label: 'Чат',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720Z"/></svg>,
    }] : []),
    {
      to: user ? '/profile' : '/auth',
      label: user ? (user.name || user.full_name || 'Профиль').split(' ')[0] : 'Кіру',
      icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 128-46.5T480-440q66 0 132 15.5T740-378q29 15 44.5 43.5T800-272v112H160Z"/></svg>,
    },
  ];

  const userName = user ? (user.name || user.full_name || 'Профиль') : 'Кіру / Тіркелу';

  return (
    <>
      <header className="fez-header">
        {/* Logo — always visible */}
        <Link to="/" className="fez-brand">
          <div className="fez-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40" fill="none">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0891B2"/>
                  <stop offset="100%" stopColor="#0e7490"/>
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="13" fill="url(#lg1)"/>
              <circle cx="24" cy="16" r="5.5" fill="white"/>
              <path d="M14 36c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M36 10 l1.2 2.4 2.8.4-2 2 .5 2.7L36 16.3l-2.5 1.3.5-2.7-2-2 2.8-.4z" fill="#fbbf24"/>
            </svg>
          </div>
          <div className="fez-logo-text">
            <span className="fez-logo-name">Sheber<span>Tab</span></span>
            <span className="fez-logo-sub">Masters Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav>
          <ul className="fez-nav-list">
            {navItems.map((item) => (
              <li key={item.to} className="fez-nav-item">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `fez-nav-link${isActive ? ' fez-nav-active' : ''}`}
                >
                  <span className="fez-icon">{item.icon}</span>
                  <span className="fez-label">{item.label}</span>
                </NavLink>
              </li>
            ))}

            <li className="fez-nav-item fez-toggle-item">
              <DarkToggle darkMode={darkMode} onToggle={onToggleDark} />
            </li>

            {user && user.role === 'admin' && (
              <li className="fez-nav-item">
                <Link to="/admin" className="fez-nav-link" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '8px' }}>
                  <span className="fez-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="22" height="22">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </span>
                  <span className="fez-label">Админ</span>
                </Link>
              </li>
            )}

            {user && (
              <li className="fez-nav-item">
                <Link to="/messages" className="fez-nav-link">
                  <span className="fez-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                      <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720Z"/>
                    </svg>
                  </span>
                  <span className="fez-label">Чат</span>
                </Link>
              </li>
            )}

            {/* Notifications */}
            {user && (
              <li className="fez-nav-item" style={{ position: 'relative' }} ref={dropdownRef}>
                <div className="fez-nav-link" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
                  <span className="fez-icon" style={{ position: 'relative' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                      <path d="M160-200v-80h80v-280q0-83 50-147.5T420-784v-28q0-25 17.5-42.5T480-872q25 0 42.5 17.5T540-812v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                    </svg>
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', minWidth: '18px', textAlign: 'center' }}>
                        {unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="fez-label">Хабар</span>
                </div>

                {showDropdown && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '16px', width: '320px', maxHeight: '440px',
                    overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    zIndex: 1000, animation: 'dropdownFadeIn 0.2s ease', transformOrigin: 'top right'
                  }}>
                    <style>{`
                      @keyframes dropdownFadeIn {
                        from { opacity: 0; transform: scale(0.92) translateY(-8px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                      }
                      .notif-item:hover { background: rgba(8,145,178,0.06) !important; }
                    `}</style>
                    <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Хабарламалар</span>
                      {unreadCount > 0 && <span style={{ fontSize: '12px', background: 'rgba(8,145,178,0.1)', color: '#0891b2', padding: '2px 8px', borderRadius: '20px' }}>{unreadCount} жаңа</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Хабарлама жоқ</div>
                    ) : (
                      notifications.map(n => (
                        <div className="notif-item" key={n.id}
                          onClick={() => {
                            if (!n.is_read) markAsRead(n.id);
                            setShowDropdown(false);
                            if (n.notification_type === 'chat' && n.sender_id) {
                              navigate(`/messages?userId=${n.sender_id}&name=${encodeURIComponent(n.title.replace('💬 ', ''))}`);
                            } else {
                              navigate('/profile', { state: { tab: 'orders' } });
                            }
                          }}
                          style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: n.is_read ? 'transparent' : 'rgba(8,145,178,0.04)', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', gap: '12px', alignItems: 'flex-start' }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.is_read ? 'transparent' : '#0891b2', marginTop: '6px', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '13px', color: n.is_read ? 'var(--text-muted)' : 'var(--text)', marginBottom: '3px' }}>{n.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>{new Date(n.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            )}

            {/* CTA */}
            <li className="fez-nav-item">
              <Link to={user ? '/profile' : '/auth'} className="fez-nav-link fez-cta-link">
                <span className="fez-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
                  </svg>
                </span>
                <span className="fez-label fez-cta-label">
                  {user ? `👤 ${(user.name || user.full_name || 'Профиль')}` : 'Кіру / Тіркелу'}
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Top Bar: Dark Toggle + User Button + Hamburger Menu */}
        <div className="fez-mobile-topbar">
          <DarkToggle darkMode={darkMode} onToggle={onToggleDark} />
          <Link to={user ? '/profile' : '/auth'} className="fez-mobile-cta">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 128-46.5T480-440q66 0 132 15.5T740-378q29 15 44.5 43.5T800-272v112H160Z"/>
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
              {user ? (user.name || user.full_name || 'Профиль').split(' ')[0] : 'Кіру'}
            </span>
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ── */}
      <div className={`mobile-fullscreen-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mobile-menu-link${isActive ? ' active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mobile-menu-icon">{item.icon}</span>
              <span className="mobile-menu-label">{item.label}</span>
            </NavLink>
          ))}
          {user && user.role === 'admin' && (
            <NavLink to="/admin" className="mobile-menu-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
              </span>
              <span className="mobile-menu-label">Админ Панель</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="fez-bottom-nav">
        {mobileNavItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`fez-bottom-item${isActive ? ' active' : ''}`}
              style={{ position: 'relative' }}
            >
              <div className="fez-bottom-icon">{item.icon}</div>
              <span className="fez-bottom-label">{item.label}</span>
            </Link>
          );
        })}

        {/* Notifications bell in bottom nav */}
        {user && (
          <button
            className={`fez-bottom-item${showDropdown ? ' active' : ''}`}
            onClick={() => setShowDropdown(v => !v)}
            style={{ position: 'relative' }}
          >
            <div className="fez-bottom-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-784v-28q0-25 17.5-42.5T480-872q25 0 42.5 17.5T540-812v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
              </svg>
              {unreadCount > 0 && (
                <span className="fez-bottom-badge">{unreadCount}</span>
              )}
            </div>
            <span className="fez-bottom-label">Хабар</span>
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;
