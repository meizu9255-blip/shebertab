import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <main className="hero">
        <div className="badge">🛠️ №1 Маман платформасы — Қазақстан</div>
        <h1>Үйіңізге сенімді<br/><span className="grad">маман керек пе?</span></h1>
        <p>Сантехник, электрик, ұста және жергілікті шеберлерді бір сәтте тауып, уақытыңызды үнемдеңіз.</p>
        <div className="hero-btns">
          <Link to="/services" className="btn btn-primary">🔍 Маман іздеу</Link>
          <Link to="/auth" className="btn btn-outline">Тіркелу →</Link>
        </div>
      </main>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">500+</div>
          <div className="stat-lbl">Тексерілген шебер</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">2 400+</div>
          <div className="stat-lbl">Орындалған тапсырыс</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">24/7</div>
          <div className="stat-lbl">Жедел қолдау</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">4.9 ★</div>
          <div className="stat-lbl">Орташа рейтинг</div>
        </div>
      </div>
    </>
  );
};

export default Home;
