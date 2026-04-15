import React, { useState, useEffect } from 'react';
import './ServiceForm.css';

function ServiceForm({ onAdd, onUpdate, editingService, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    price: '',
    phone: '',
    image: ''
  });

  // Populate form if editing
  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    } else {
      setFormData({ name: '', service: '', price: '', phone: '', image: '' });
    }
  }, [editingService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.service || !formData.price || !formData.phone) {
      alert("Барлық жолақтарды толтырыңыз!");
      return;
    }
    
    if (editingService) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    
    setFormData({ name: '', service: '', price: '', phone: '', image: '' });
  };

  return (
    <div className="form-container">
      <h2>{editingService ? "Қызметті өңдеу" : "Жаңа маман қосу"}</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Аты-жөні" />
        <select name="service" value={formData.service} onChange={handleChange}>
          <option value="">Қызмет түрін таңдаңыз</option>
          <option value="Сантехник қызметі">Сантехник қызметі</option>
          <option value="Электрик қызметі">Электрик қызметі</option>
          <option value="Жиһаз құрастыру">Жиһаз құрастыру</option>
          <option value="Тазалық қызметі">Тазалық қызметі</option>
        </select>
        <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Бағасы (мысалы: 5000 ₸)" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Телефон нөмірі" />
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Сурет сілтемесі (URL)" />
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">{editingService ? "Сақтау" : "Қосу"}</button>
          {editingService && <button type="button" className="btn-secondary" onClick={onCancel}>Болдырмау</button>}
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
