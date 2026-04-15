import React from 'react';
import './FilterHeader.css';

function FilterHeader({ searchTerm, onSearchChange, filterCategory, onFilterChange }) {
  return (
    <div className="filter-header">
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Маман атын іздеу..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-box">
        <select value={filterCategory} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="All">Барлық қызметтер</option>
          <option value="Сантехник қызметі">Сантехник</option>
          <option value="Электрик қызметі">Электрик</option>
          <option value="Жиһаз құрастыру">Жиһаз</option>
          <option value="Тазалық қызметі">Тазалық</option>
        </select>
      </div>
    </div>
  );
}

export default FilterHeader;
