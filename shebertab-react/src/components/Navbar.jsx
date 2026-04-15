import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';
import DarkToggle from './DarkToggle';

const Navbar = ({ darkMode, onToggleDark }) => {
  const navItems = [
    {
      to: '/',
      end: true,
      label: 'Басты',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
          <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
        </svg>
      ),
    },
    {
      to: '/about',
      label: 'Туралы',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
          <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
      ),
    },
    {
      to: '/services',
      label: 'Қызметтер',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
          <path d="m706-136-75-75 51-51-106-106-51 51-75-75 51-51-85-85-51 51-75-75 199-199q14-14 34-14t34 14l75 75 50-51q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T838-633l-51 50 75 75q14 14 14 34t-14 34L706-136Zm-20-212 56-56-169-169-56 56 169 169ZM314-240q-45 0-82-27t-51-71L80-680l84 84q17 17 17 42t-17 42q-17 17-42 17t-42-17L0-592l83 83q15 15 21 33t6 37l90 90q14 14 14 34t-14 34l-75 75-75-75q-14-14-14-34t14-34l-41-39q-20-20-20-48t20-47l-95-95 152 152q17 17 42 17t42-17q17-17 17-42t-17-42L80-800l192 192q13 13 20.5 29t9.5 34l22 22q0-17 6-33t18-28l159-159q21-21 50-21t50 21l75 75q21 21 21 50t-21 50L763-440q12 14 18 30.5t6 34.5v21l-21-21q-12-12-12-28.5T766-432L634-564q-13-13-31-13t-31 13l-35 35 88 88q17 17 17 41.5T625-357q-17 17-41.5 17T542-357L406-493q-10 10-10 24t10 24l150 150q24 24 26 58t-22 58l-75 75q-14 14-34 14t-34-14l-103-103q-14-14-14-34t14-34l75-75Z"/>
        </svg>
      ),
    },
    {
      to: '/blog',
      label: 'Блог',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
          <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-221q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/>
        </svg>
      ),
    },
    {
      to: '/contact',
      label: 'Байланыс',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
          <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
        </svg>
      ),
    },
  ];

  return (
    <header className="fez-header">
      <Link to="/" className="fez-brand">
        <div className="fez-logo-icon">🔧</div>
        <div className="fez-logo-text">
          <span className="fez-logo-name">Sheber<span>Tab</span></span>
          <span className="fez-logo-sub">Masters Platform</span>
        </div>
      </Link>

      <nav>
        <ul className="fez-nav-list">
          {navItems.map((item) => (
            <li key={item.to} className="fez-nav-item">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `fez-nav-link${isActive ? ' fez-nav-active' : ''}`
                }
              >
                <span className="fez-icon">{item.icon}</span>
                <span className="fez-label">{item.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Dark Mode Sun/Moon Toggle */}
          <li className="fez-nav-item fez-toggle-item">
            <DarkToggle darkMode={darkMode} onToggle={onToggleDark} />
          </li>

          {/* CTA */}
          <li className="fez-nav-item">
            <Link to="/auth" className="fez-nav-link fez-cta-link">
              <span className="fez-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
                </svg>
              </span>
              <span className="fez-label fez-cta-label">Кіру / Тіркелу</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
