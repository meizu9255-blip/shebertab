import React from 'react';
import './ServiceCard.css';

function ServiceCard({ service, onDelete, onEdit }) {
  return (
    <div className="service-card">
      <div className="service-img" style={{ backgroundImage: `url(${service.image})` }}></div>
      <div className="service-content">
        <h3>{service.name}</h3>
        <p className="service-type">🔧 {service.service}</p>
        <p className="service-price">💰 {service.price}</p>
        <p className="service-phone">📞 {service.phone}</p>
        <div className="service-actions">
          <button className="btn-edit" onClick={() => onEdit(service)}>Өңдеу</button>
          <button className="btn-delete" onClick={() => onDelete(service.id)}>Өшіру</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
