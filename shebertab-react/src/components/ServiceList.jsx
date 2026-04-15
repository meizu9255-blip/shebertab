import React from 'react';
import ServiceCard from './ServiceCard';
import './ServiceList.css';

function ServiceList({ services, onDelete, onEdit }) {
  if (services.length === 0) {
    return <p className="no-data">Қызметтер табылған жоқ 📭</p>;
  }

  return (
    <div className="service-list">
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ServiceList;
