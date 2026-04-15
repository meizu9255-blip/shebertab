import React from 'react';
import './DarkToggle.css';

const DarkToggle = ({ darkMode, onToggle }) => {
  return (
    <label className="dt-switch" title="Түнгі режим">
      <input
        type="checkbox"
        className="dt-input"
        checked={darkMode}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="dt-track">
        {/* Night elements */}
        <div className="dt-stars"></div>
        <div className="dt-shooting"></div>

        {/* Day elements */}
        <div className="dt-clouds">
          <div className="dt-cloud dt-cloud--1"></div>
          <div className="dt-cloud dt-cloud--2"></div>
        </div>

        {/* Orb (sun → moon) */}
        <div className="dt-orb">
          <div className="dt-crater dt-crater--1"></div>
          <div className="dt-crater dt-crater--2"></div>
          <div className="dt-crater dt-crater--3"></div>
        </div>
      </div>
    </label>
  );
};

export default DarkToggle;
