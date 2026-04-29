import React from 'react';
import './FilterHeader.css';

function FilterHeader({ searchTerm, onSearchChange, filterCategory, onFilterChange, categories = [] }) {
  return (
    <div className="filter-bar">
      
      <div className="search-wrapper">
        <input 
          placeholder="Маманды іздеу..." 
          type="text" 
          className="search-input" 
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <select
        className="form-input filter-select"
        value={filterCategory}
        onChange={e => onFilterChange(e.target.value)}
      >
        <option value="All">Барлық қызметтер</option>
        {categories.map(c => (
          <option key={c.id} value={c.title}>{c.title}</option>
        ))}
      </select>
    </div>
  );
}

export default FilterHeader;
