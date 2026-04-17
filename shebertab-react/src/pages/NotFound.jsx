import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '10px' }}>404</h1>
      <h2 style={{ marginBottom: '20px' }}>Бет табылмады</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Упс! Сіз іздеген парақша бұл жерде жоқ сияқты.</p>
      <Link to="/" className="btn btn-primary">Басты бетке қайту</Link>
    </div>
  );
};

export default NotFound;
