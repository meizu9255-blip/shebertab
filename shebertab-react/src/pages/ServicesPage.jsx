import React, { useState, useEffect } from 'react';
import API_URL from '../config';
import ServiceList from '../components/ServiceList';
import FilterHeader from '../components/FilterHeader';
import './ServicesPage.css';

const EMPTY = { name: '', service: '', price: '', phone: '', image: '' };

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingService, setEditingService] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [formAlert, setFormAlert] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch categories from API
    fetch(`${API_URL}/api/services`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(console.error);

    // Fetch user to determine role
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(console.error);
    }
    const MOCK_IMAGES = {
      'Асқар Жақсылықов': 'https://i.pinimg.com/736x/1e/33/3d/1e333d1dc2fb63365f2d48dc5dcf36c0.jpg',
      'Дәурен Сейітов': 'https://i.pinimg.com/1200x/19/cf/e5/19cfe5855816592b5d420e9e19396753.jpg',
      'Нұрлан Бекенов': 'https://i.pinimg.com/736x/2e/e9/50/2ee95040f79ca8074c95f77f1d6cdfac.jpg',
      'Айгүл Мұсаева': 'https://i.pinimg.com/736x/b4/f1/93/b4f193ccaa0fe4cde6b796b796a73b90.jpg',
      'Ермек Тоқтаров': 'https://i.pinimg.com/736x/6a/84/a2/6a84a2786761314d87f6d0ae11b01ed5.jpg',
      'Самал Ахметова': 'https://i.pinimg.com/736x/66/c1/96/66c196d2702e763741ad28a433b7449f.jpg'
    };

    fetch(`${API_URL}/api/workers`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(w => ({
            id: w.id,
            name: w.name,
            service: w.service_name,
            price: w.price_range,
            phone: w.phone || w.email,
            rating: w.rating || 0,
            image: MOCK_IMAGES[w.name] || ''
          }));
          setServices(mapped);
        }
      })
      .catch(console.error);
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

  const handleOrder = async (workerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Тапсырыс беру үшін жүйеге кіру қажет!');
      window.location.href = '/auth';
      return;
    }

    try {
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meData = await meRes.json();
      if (!meData.user) return;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: meData.user.id, worker_id: workerId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Тапсырыс сәтті қабылданды! Жеке кабинеттен көре аласыз.');
      } else {
        alert(data.error || 'Қате орын алды!');
      }
    } catch (err) {
      alert('Сервермен байланыс жоқ!');
    }
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

  const handleDelete = async (id) => {
    if (!window.confirm('Бұл маманды өшіруге сенімдісіз бе?')) return;
    
    // Бұл нағыз базадағы маман, сондықтан бэкендке өшіру сұранысын жібереміз
    try {
      await fetch(`${API_URL}/api/workers/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Өшіру кезінде қате орын алды', err);
    }
    
    // UI-дан өшіру
    setServices(prev => prev.filter(s => s.id !== id));
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
        <div className="badge">⚙️ Мамандар </div>
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
            categories={categories}
          />
          {isAdmin && (
            <button className="btn btn-primary svc-add-btn" onClick={openAdd}>
              ➕ Маман қосу
            </button>
          )}
        </div>

        {/* Cards */}
        <ServiceList
          services={filtered}
          onDelete={isAdmin ? handleDelete : null}
          onEdit={isAdmin ? openEdit : null}
          onOrder={handleOrder}
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

            {formAlert && <div className="alert error show" style={{ marginBottom: '14px' }}>{formAlert}</div>}

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
                  {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
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
