import React from 'react';
import './FilterHeader.css';

const CATEGORIES = [
  'All',
  'Сантехник қызметі',
  'Электрик қызметі',
  'Жиһаз құрастыру',
  'Тазалық қызметі',
  'Ұзата жөндеу',
];

function FilterHeader({ searchTerm, onSearchChange, filterCategory, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-search">
        <span className="filter-search-icon">🔍</span>
        <input
          className="form-input filter-input"
          type="text"
          placeholder="Маман атымен іздеу..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="form-input filter-select"
        value={filterCategory}
        onChange={e => onFilterChange(e.target.value)}
      >
        {CATEGORIES.map(c => (
          <option key={c} value={c}>{c === 'All' ? 'Барлық қызметтер' : c}</option>
        ))}
      </select>
    </div>
  );
}

export default FilterHeader;
