import React from 'react';
import './ServiceCard.css';

const FALLBACK = 'https://ui-avatars.com/api/?background=0891B2&color=fff&size=300&bold=true&name=';

function ServiceCard({ service, onDelete, onEdit }) {
  const imgSrc = service.image || `${FALLBACK}${encodeURIComponent(service.name)}`;

  return (
    <div className="svc-card">
      <div className="svc-img-wrap">
        <img
          src={imgSrc}
          alt={service.name}
          className="svc-img"
          onError={(e) => { e.target.src = `${FALLBACK}${encodeURIComponent(service.name)}`; }}
        />
        <span className="svc-badge">{service.service}</span>
      </div>
      <div className="svc-body">
        <h3 className="svc-name">{service.name}</h3>
        <div className="svc-meta">
          <span>💰 {service.price}</span>
          <span>📞 {service.phone}</span>
        </div>
        <div className="svc-actions">
          <button className="btn btn-outline svc-btn-edit" onClick={() => onEdit(service)}>
            ✏️ Өңдеу
          </button>
          <button className="btn svc-btn-delete" onClick={() => onDelete(service.id)}>
            🗑 Өшіру
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
