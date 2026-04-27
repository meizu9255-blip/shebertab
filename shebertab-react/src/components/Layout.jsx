import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = (val) => {
    setDarkMode(val);
    document.body.classList.toggle('dark-theme', val);
  };

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDark={toggleDark} />
      <div style={{ paddingTop: '90px' }}>
        <Outlet />
      </div>

      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '52px 0 24px',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* 4-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36" height="36" fill="none">
                  <defs>
                    <linearGradient id="fLg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0891B2"/>
                      <stop offset="100%" stopColor="#0e7490"/>
                    </linearGradient>
                  </defs>
                  <rect width="48" height="48" rx="13" fill="url(#fLg2)"/>
                  <circle cx="24" cy="16" r="5.5" fill="white"/>
                  <path d="M14 36c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M36 10 l1.2 2.4 2.8.4-2 2 .5 2.7L36 16.3l-2.5 1.3.5-2.7-2-2 2.8-.4z" fill="#fbbf24"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text)' }}>
                  Sheber<span style={{ color: '#0891b2' }}>Tab</span>
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Қазақстандағы сенімді маман табу платформасы. Тез, қауіпсіз, тиімді.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '13px', marginBottom: '16px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Навигация</h4>
              {[
                { to: '/', label: 'Басты бет' },
                { to: '/about', label: 'Біз туралы' },
                { to: '/services', label: 'Мамандар' },
                { to: '/blog', label: 'Блог' },
                { to: '/contact', label: 'Байланыс' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '9px', textDecoration: 'none' }}>{l.label}</Link>
              ))}
            </div>

            {/* Services */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '13px', marginBottom: '16px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Қызметтер</h4>
              {['Үй тазалау', 'Электрик', 'Сантехник', 'Құрылыс / Жөндеу', 'Бояу жұмыстары'].map(s => (
                <Link key={s} to="/services" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '9px', textDecoration: 'none' }}>{s}</Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '13px', marginBottom: '16px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Байланыс</h4>
              {[
                { icon: '📍', text: 'Астана қ., Мәңгілік Ел к-сі, 55' },
                { icon: '📞', text: '+7 (701) 123-45-67' },
                { icon: '📧', text: 'info@shebertab.kz' },
                { icon: '🕐', text: 'Дс–Жс: 08:00–22:00' },
              ].map(c => (
                <div key={c.text} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              © 2026 SheberTab. Барлық құқықтар қорғалған.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Құпиялылық саясаты', 'Пайдалану шарттары'].map(t => (
                <a key={t} href="#" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
