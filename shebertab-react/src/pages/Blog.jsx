import React from 'react';

const Blog = () => {
  const handleBlogAlert = (e) => {
    e.preventDefault();
    alert('📖 Бұл мақаланың толық нұсқасы жақында жарияланады! Бізбен бірге болыңыз.');
  };

  return (
    <>
      <section className="page-hero">
        <div className="badge">📝 Пайдалы мақалалар</div>
        <h1>Блог және <span className="grad">кеңестер</span></h1>
        <p>Тұрмыстық жөндеу, маман таңдау және платформа туралы пайдалы материалдар</p>
      </section>

      <div className="container">
        <div className="blog-grid fade-up">

          <article className="blog-card">
            <div className="blog-card-img">🔐</div>
            <div className="blog-card-body">
              <p className="blog-cat">Кеңес</p>
              <h3>Сенімді шеберді қалай таңдаймыз?</h3>
              <p>Маманның рейтингі мен бұрынғы клиенттердің пікірлерін оқудың маңыздылығы өте зор...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-img">⚡</div>
            <div className="blog-card-body">
              <p className="blog-cat">Қауіпсіздік</p>
              <h3>Электр тогымен абай болыңыз!</h3>
              <p>Үйдегі розеткадан ұшқын шыққан жағдайдағы алғашқы қауіпсіздік шаралары...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-img">💼</div>
            <div className="blog-card-body">
              <p className="blog-cat">Шеберлерге</p>
              <h3>Фрилансер-мамандарға кеңес</h3>
              <p>Платформада профиліңізді дұрыс толтырып, көп тапсырыс алу жолдары...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-img">🔧</div>
            <div className="blog-card-body">
              <p className="blog-cat">Жөндеу</p>
              <h3>Краны өзіңіз жөндей аласыз ба?</h3>
              <p>Қарапайым сантехникалық жұмыстарды өзіңіз жасаудың мүмкін болатын тәсілдері...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-img">🏠</div>
            <div className="blog-card-body">
              <p className="blog-cat">Үй дизайны</p>
              <h3>2026 жылғы үй жөндеу трендтері</h3>
              <p>Биыл қандай материалдар мен стильдер сұранысқа ие болып жатыр — шолу...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-img">📱</div>
            <div className="blog-card-body">
              <p className="blog-cat">Технология</p>
              <h3>ШеберТаб қосымшасы жаңартылды</h3>
              <p>Жаңа мүмкіндіктер: жедел чат, онлайн төлем, маман GPS картасы...</p>
              <a href="#" className="read-more" onClick={handleBlogAlert}>Толығырақ оқу →</a>
            </div>
          </article>

        </div>
      </div>
    </>
  );
};

export default Blog;
