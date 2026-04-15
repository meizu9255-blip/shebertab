import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
      <footer>
        <p>Автор: Әлімбек Бексұлтан | &copy; 2026 ШеберТаб</p>
        <div className="footer-links">
          <a href="#">Instagram</a>
          <a href="#">Telegram</a>
          <a href="#">GitHub</a>
        </div>
      </footer>
    </>
  );
};

export default Layout;
