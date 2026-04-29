import React, { useState } from 'react';
import API_URL from '../config';

const Contact = () => {
  // Practice 2 connection - Validation
  const [alert, setAlert] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.cName.value.trim();
    const email = e.target.cEmail.value.trim();
    const msg = e.target.cMessage.value.trim();

    if (!name || !email || !msg) {
      setAlert({ text: '❌ Барлық өрістерді толтырыңыз!', type: 'alert error show' });
      return;
    }
    
    if (!email.includes('@')) {
      setAlert({ text: '❌ Email дұрыс емес!', type: 'alert error show' });
      return;
    }

    setAlert({ text: '⏳ Жіберілуде...', type: 'alert show' });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg })
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ text: '✅ Өтінім қабылданды! Жақында хабарласамыз.', type: 'alert success show' });
        e.target.reset();
      } else {
        setAlert({ text: `❌ Қате: ${data.error}`, type: 'alert error show' });
      }
    } catch (err) {
      setAlert({ text: '❌ Сервермен байланыс жоқ', type: 'alert error show' });
    }

    setTimeout(() => { setAlert({ text: '', type: 'alert' }); }, 5000);
  };

  return (
    <>
      <section className="page-hero">
        <div className="badge">📬 Хабарлама жіберіңіз</div>
        <h1>Бізбен <span className="grad">байланысыңыз</span></h1>
        <p>Маман шақыру, сұрақ қою немесе серіктестік туралы — бәрі осы жерде</p>
      </section>

      <div className="container">
        <div className="contact-grid fade-up">
          
          <div className="contact-form-card">
            <h2>Өтінім жіберу</h2>
            <p>Форманы толтырыңыз, біз 1 сағат ішінде хабарласамыз</p>

            <div className={alert.type || 'alert'} style={{marginBottom: '16px'}}>
              {alert.text}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="cName">Аты-жөніңіз</label>
                <input className="form-input" type="text" id="cName" placeholder="Мысалы: Beksultan A." required />
              </div>
              <div className="form-group">
                <label htmlFor="cEmail">Email</label>
                <input className="form-input" type="email" id="cEmail" placeholder="example@gmail.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="cMessage">Хабарлама</label>
                <textarea className="form-input" id="cMessage" rows="5" placeholder="Сұранысыңызды немесе сұрағыңызды жазыңыз..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                📨 Жіберу
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h2>Байланыс ақпараты</h2>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h4>Мекенжай</h4>
                <p>Астана қаласы, Мангилик Ел к-сі, 55-үй</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h4>Телефон</h4>
                <p>+7 (701) 123-45-67</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>info@shebertab.kz</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div>
                <h4>Жұмыс уақыты</h4>
                <p>Дүйсенбі–Жексенбі: 08:00–22:00</p>
              </div>
            </div>

            <div className="map-wrap">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160298.54140026364!2d71.30906260799865!3d51.14798695039234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580c47204eb53%3A0xedec8ea59b8ebbd6!2z0LzQtdC60LXQvdC20LDQuQ!5e0!3m2!1skk!2skz!4v1713000000000"
                height="220" loading="lazy" allowFullScreen>
              </iframe>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;
