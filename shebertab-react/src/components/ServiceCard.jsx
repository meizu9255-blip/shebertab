import React, { useState } from 'react';
import './ServiceCard.css';

const FALLBACK_BASE = 'https://ui-avatars.com/api/?background=0891B2&color=fff&size=300&bold=true&font-size=0.4&name=';

function ServiceCard({ service, onDelete, onEdit, onOrder }) {
  const [imgError, setImgError] = useState(false);
  const fallbackSrc = `${FALLBACK_BASE}${encodeURIComponent(service.name)}`;
  const imgSrc = (!service.image || imgError) ? fallbackSrc : service.image;

  return (
    <div className="svc-card">
      <div className="svc-img-wrap">
        <img
          src={imgSrc}
          alt={service.name}
          className="svc-img"
          onError={() => { if (!imgError) setImgError(true); }}
        />
        <span className="svc-badge">{service.service}</span>
      </div>
      <div className="svc-body">
        <h3 className="svc-name">{service.name}</h3>
        <div className="svc-meta">
          <span>⭐ {Number(service.rating).toFixed(1)}</span>
          <span>💰 {service.price}</span>
          <span>📞 {service.phone}</span>
        </div>
      </div>
      <div className="svc-actions">
        <button className="svc-btn-edit" onClick={() => onOrder && onOrder(service.id)} style={{ background: '#0ea5e9', color: '#ffffff', border: 'none' }}>
          Тапсырыс беру
        </button>
        {onEdit && (
          <button className="svc-btn-edit" onClick={() => onEdit(service)}>
            Өңдеу
          </button>
        )}
        {onDelete && (
          <button className="tw-del-btn" onClick={() => onDelete(service.id)}>
            <svg viewBox="0 0 448 512" className="tw-del-svg"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;
