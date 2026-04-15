import React, { useState, useEffect } from 'react';
import './App.css';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import FilterHeader from './components/FilterHeader';

function App() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingService, setEditingService] = useState(null);

  // 1. Fetch initial data from local JSON (API қолдану талабы)
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Деректерді алуда қателік:", err));
  }, []);

  // CRUD: Create
  const handleAddData = (newService) => {
    const serviceWithId = { ...newService, id: Date.now() };
    setServices([...services, serviceWithId]);
  };

  // CRUD: Update
  const handleUpdateData = (updatedService) => {
    const newArr = services.map(s => s.id === updatedService.id ? updatedService : s);
    setServices(newArr);
    setEditingService(null);
  };

  // CRUD: Delete
  const handleDeleteData = (id) => {
    const confirmDelete = window.confirm("Бұл маманды өшіргіңіз келе ме?");
    if (confirmDelete) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  // Search & Filter Logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || service.service === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🔧</span>
          <div className="logo-text">Sheber<span className="accent">Tab</span></div>
        </div>
        <h1>Жергілікті қызмет табу жүйесі (React CRUD)</h1>
      </header>

      <main className="app-main">
        <ServiceForm 
          onAdd={handleAddData} 
          onUpdate={handleUpdateData}
          editingService={editingService}
          onCancel={() => setEditingService(null)}
        />
        
        <FilterHeader 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
        />

        <ServiceList 
          services={filteredServices} 
          onDelete={handleDeleteData} 
          onEdit={setEditingService}
        />
      </main>
    </div>
  );
}

export default App;
