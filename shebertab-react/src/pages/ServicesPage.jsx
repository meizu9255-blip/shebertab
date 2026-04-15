import React, { useState, useEffect } from 'react';
import ServiceList from '../components/ServiceList';
import FilterHeader from '../components/FilterHeader';
import './ServicesPage.css';

const CATEGORIES = [
  'Сантехник қызметі',
  'Электрик қызметі',
  'Жиһаз құрастыру',
  'Тазалық қызметі',
  'Ұзата жөндеу',
  'Тіс дәрігері',
];

const EMPTY = { name: '', service: '', price: '', phone: '', image: '' };

const ServicesPage = () => {
  const [services, setServices]         = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingService, setEditingService] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState(EMPTY);
  const [formAlert, setFormAlert] = useState('');

  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then(d => setServices(d))
      .catch(() => {});
  }, []);

  // Open modal for add
  const openAdd = () => {
    setEditingService(null);
    setFormData(EMPTY);
    setFormAlert('');
    setShowModal(true);
  };

  // Open modal for edit
  const openEdit = (svc) => {
    setEditingService(svc);
    setFormData(svc);
    setFormAlert('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData(EMPTY);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.service || !formData.price || !formData.phone) {
      setFormAlert('❌ Барлық жолақтарды толтырыңыз!');
      return;
    }
    if (editingService) {
      setServices(services.map(s => s.id === formData.id ? formData : s));
    } else {
      setServices([...services, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Бұл маманды өшіргіңіз келе ме?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const filtered = services.filter(s => {
    const q = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const c = filterCategory === 'All' || s.service === filterCategory;
    return q && c;
  });

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="badge">⚙️ CRUD жүйесі (React)</div>
        <h1>Маман <span className="grad">тізімі</span></h1>
        <p>Платформадағы шеберлерді іздеңіз, қосыңыз, өңдеңіз немесе өшіріңіз</p>
      </section>

      <div className="container">
        {/* Top toolbar */}
        <div className="svc-toolbar">
          <FilterHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
          />
          <button className="btn btn-primary svc-add-btn" onClick={openAdd}>
            ➕ Маман қосу
          </button>
        </div>

        {/* Cards */}
        <ServiceList
          services={filtered}
          onDelete={handleDelete}
          onEdit={openEdit}
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 className="modal-title">
              {editingService ? '✏️ Маманды өңдеу' : '➕ Жаңа маман қосу'}
            </h2>

            {formAlert && <div className="alert error show" style={{marginBottom:'14px'}}>{formAlert}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Аты-жөні</label>
                <input className="form-input" type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Мысалы: Асқар" />
              </div>
              <div className="form-group">
                <label>Қызмет түрі</label>
                <select className="form-input" name="service" value={formData.service} onChange={handleChange}>
                  <option value="">Таңдаңыз...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Бағасы</label>
                <input className="form-input" type="text" name="price" value={formData.price}
                  onChange={handleChange} placeholder="5000 ₸" />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input className="form-input" type="text" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="+7 701 ..." />
              </div>
              <div className="form-group">
                <label>Сурет URL (міндетті емес)</label>
                <input className="form-input" type="text" name="image" value={formData.image}
                  onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Болдырмау</button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? '💾 Сақтау' : '✅ Қосу'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesPage;
