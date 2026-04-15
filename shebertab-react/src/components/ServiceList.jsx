import React from 'react';
import ServiceCard from './ServiceCard';

function ServiceList({ services, onDelete, onEdit }) {
  if (services.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: 'var(--muted)',
        background: 'var(--surface)',
        borderRadius: '16px',
        border: '1px dashed var(--border)',
        marginTop: '16px'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '12px'}}>🔍</div>
        <p style={{fontWeight: 600, color: 'var(--text)'}}>Маман табылмады</p>
        <p style={{fontSize: '0.9rem', marginTop: '6px'}}>Іздеу шартын өзгертіңіз немесе жаңа маман қосыңыз</p>
      </div>
    );
  }

  return (
    <div className="services-grid">
      {services.map(s => (
        <ServiceCard key={s.id} service={s} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default ServiceList;
