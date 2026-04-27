import React, { useState } from 'react';

const About = () => {
  // Prac 2 (Show/Hide FAQ logic)
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <>
      <section className="page-hero">
        <div className="badge">🏢 Платформа туралы</div>
        <h1>Біз <span className="grad">туралы</span></h1>
        <p>ШеберТаб — тапсырыс берушілер мен кәсіби шеберлерді байланыстыратын сенімді платформа</p>
      </section>

      <div className="container">
        <div className="about-split fade-up">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80"
              alt="Шебер жұмыс істеп жатыр" 
              className="about-img" 
            />
          </div>
          <div className="about-text">
            <h2>Біздің миссиямыз</h2>
            <p>Бұл платформа тұтынушылар мен жергілікті қызмет көрсетуші мамандарды қауіпсіз, тез әрі ыңғайлы түрде байланыстыру мақсатында құрылған.</p>
            <p>Біздің басты мақсатымыз — сіздің уақытыңызды үнемдеу және тұрмыстық ақауларды сенімді маманға тиімді бағамен жөндетуге көмектесу.</p>
            <p>2024 жылдан бастап жұмыс істейміз. Бүгінде 500+ тексерілген маманымыз бар.</p>
            
            {/* Practical 2 FAQ block using original styling paradigms */}
            <div style={{marginTop: '20px', padding: '15px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
              <div 
                onClick={() => setShowFAQ(!showFAQ)} 
                style={{display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent)'}}
              >
                <span>Жиі қойылатын сұрақтар (FAQ)</span>
                <span>{showFAQ ? '▲' : '▼'}</span>
              </div>
              {showFAQ && (
                <div style={{marginTop: '10px', fontSize: '0.9rem', color: 'var(--muted)', paddingTop: '10px', borderTop: '1px solid var(--border)'}}>
                  <p><strong>С: Мамандар қалай тексеріледі?</strong></p>
                  <p>Ж: Барлық шеберлер базаға қосылмас бұрын жеке басын куәландыратын құжаттар және тест арқылы тексеріледі.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="values-grid fade-up">
          <div className="value-card">
            <div className="value-icon">🔐</div>
            <h3>Сенімділік</h3>
            <p>Барлық шеберлер тексерілген, рейтингтелген және верификацияланған</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⚡</div>
            <h3>Жылдамдық</h3>
            <p>Тапсырысты 15 минутта орналастырып, маман тауып аласыз</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💎</div>
            <h3>Сапа</h3>
            <p>Жұмыс сапасына толық кепілдік беріледі</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💸</div>
            <h3>Ашық баға</h3>
            <p>Жасырын төлемдер жоқ — бағаны алдын ала сіз белгілейсіз</p>
          </div>
        </div>

        <h2 className="section-title" style={{textAlign:'center'}}>Платформа нәтижелері</h2>
        <p className="section-sub" style={{textAlign:'center'}}>Сандармен айтсақ</p>

        <div className="team-grid fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
          <div className="team-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#0891b2', marginBottom: '6px' }}>500+</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Тексерілген маман</p>
          </div>
          <div className="team-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#0891b2', marginBottom: '6px' }}>2 000+</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Орындалған тапсырыс</p>
          </div>
          <div className="team-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#0891b2', marginBottom: '6px' }}>4.8 ⭐</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Орташа рейтинг</p>
          </div>
          <div className="team-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#0891b2', marginBottom: '6px' }}>15 мин</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Маман табу уақыты</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default About;