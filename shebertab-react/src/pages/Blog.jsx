import React, { useState } from 'react';

const ARTICLES = [
  {
    id: 1,
    emoji: '🔐',
    cat: 'Кеңес',
    title: 'Сенімді шеберді қалай таңдаймыз?',
    preview: 'Маманның рейтингі мен бұрынғы клиенттердің пікірлерін оқудың маңыздылығы өте зор...',
    full: `Сенімді маман таңдаудың бірнеше негізгі критерийлері бар:

**1. Рейтинг пен пікірлер**
Маманның профиліндегі жұлдыз рейтингі мен алдыңғы клиенттердің пікірлерін мұқият оқыңыз. 4.5 жұлдыздан жоғары болғаны жөн.

**2. Орындалған тапсырыстар саны**
Тәжірибелі маман — 50+ орындалған тапсырыспен. Жаңадан бастаушыларға абай болыңыз.

**3. Профильдің толықтығы**
Суреті, байланыс мәліметтері, қызмет сипаттамасы толық берілгені — маманның жауапкершілігін көрсетеді.

**4. Жауап беру жылдамдығы**
Жедел жауап беретін маман сенімді. Платформадағы "онлайн" мәртебесіне назар аударыңыз.

**5. Баға мен уақыт**
Алдын ала бағаны нақтылап алыңыз. Тым арзан баға — сапасыз жұмыстың белгісі болуы мүмкін.`
  },
  {
    id: 2,
    emoji: '⚡',
    cat: 'Қауіпсіздік',
    title: 'Электр тогымен абай болыңыз!',
    preview: 'Үйдегі розеткадан ұшқын шыққан жағдайдағы алғашқы қауіпсіздік шаралары...',
    full: `Электр қауіпсіздігі — үй иесінің бірінші міндеті.

**Ұшқын шықса не істеу керек:**
1. Дереу ток сымын суырып алмаңыз — алдымен ажыратқышты өшіріңіз
2. Судың жанынан алыс болыңыз
3. Жанып кеткен иіс сезсеңіз — үйден шығыңыз

**Алдын алу шаралары:**
- Ескі розеткаларды жыл сайын тексеріңіз
- Қуатты жабдықтарды (кір жуғыш, тоңазытқыш) бөлек розеткаға жалғаңыз
- Ылғал бөлмелерде арнайы су өткізбейтін розетка қолданыңыз
- Электрик жұмысын тек маманға тапсырыңыз`
  },
  {
    id: 3,
    emoji: '💼',
    cat: 'Шеберлерге',
    title: 'Фрилансер-мамандарға кеңес',
    preview: 'Платформада профиліңізді дұрыс толтырып, көп тапсырыс алу жолдары...',
    full: `SheberTab платформасында табысты болу жолдары:

**Профиліңізді толтырыңыз:**
- Нақты сурет қойыңыз
- Тәжірибеңізді нақты жазыңыз
- Баға диапазоныңызды анық көрсетіңіз

**Жылдам жауап беріңіз:**
Тапсырыс келгенде 15 минут ішінде жауап берсеңіз — клиент сізді таңдауы мүмкін.

**Сапалы жұмыс жасаңыз:**
Әр тапсырыстан кейін клиент бағалайды. Жоғары рейтинг — көп тапсырыс.

**Мамандануыңызды нақтылаңыз:**
"Электрик" деп жазудан гөрі "Үй розетка орнату, щит жөндеу" деп нақтылаңыз.`
  },
  {
    id: 4,
    emoji: '🔧',
    cat: 'Жөндеу',
    title: 'Краны өзіңіз жөндей аласыз ба?',
    preview: 'Қарапайым сантехникалық жұмыстарды өзіңіз жасаудың мүмкін болатын тәсілдері...',
    full: `Кейбір қарапайым сантехника жұмыстарын өзіңіз жасай аласыз:

**Тамшылаған кран:**
1. Судың негізгі клапанын жабыңыз
2. Кранның басындағы бұранданы ашыңыз
3. Резеңке прокладканы ауыстырыңыз (дүкеннен 200-500₸)
4. Кері бұраңыз

**Кедей ағып жатқан труба:**
- Уақытша: сантехникалық лентамен (фум-лента) оңдаңыз
- Тұрақты шешім: маманды шақырыңыз

**НЕ жасамаңыз:**
Стояктарды, горячий суды, газды — міндетті түрде маманға тапсырыңыз!`
  },
  {
    id: 5,
    emoji: '🏠',
    cat: 'Үй дизайны',
    title: '2026 жылғы үй жөндеу трендтері',
    preview: 'Биыл қандай материалдар мен стильдер сұранысқа ие болып жатыр — шолу...',
    full: `2026 жылы үй безендіруде не өзекті?

**Материалдар:**
- Табиғи тас пен ағаш комбинациясы
- Жасыл түстер (сейдж, хаки, оливка)
- Матовые поверхности — жылтыр бояудан бас тарту

**Стильдер:**
- Japandi (жапондық + скандинавтық минимализм)
- Wabi-sabi — кемелсіздіктің сұлулығы
- Биофильді дизайн — өсімдіктер мен табиғат

**Функционалдылық:**
- Жасырын сақтау орындары
- Икемді кеңістік (жұмыс + демалыс)
- Ақылды үй технологиялары`
  },
  {
    id: 6,
    emoji: '📱',
    cat: 'Технология',
    title: 'SheberTab жаңартулары — 2026',
    preview: 'Жаңа мүмкіндіктер: жедел чат, онлайн төлем, маман GPS картасы...',
    full: `SheberTab платформасының жаңа мүмкіндіктері:

**Жедел чат:**
Маманмен тікелей хабарлама алмасыңыз. Суреттер жіберіңіз, жағдайды сипаттаңыз.

**Хабарлама жүйесі:**
- Тапсырыс қабылданғанда дереу хабарлама
- Жұмыс аяқталғанда бағалау сұрауы
- Чат хабарламаларын хабарламалар бөлімінен көріңіз

**Рейтинг жүйесі:**
5 жұлдызды бағалау жүйесі — мамандар сапасын арттыруға ынталандырады.

**Жоспарда:**
- GPS арқылы маман орнын бақылау
- Онлайн төлем жүйесі
- Видео консультация мүмкіндігі`
  },
];

const Blog = () => {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section className="page-hero">
        <div className="badge">📝 Пайдалы мақалалар</div>
        <h1>Блог және <span className="grad">кеңестер</span></h1>
        <p>Тұрмыстық жөндеу, маман таңдау және платформа туралы пайдалы материалдар</p>
      </section>

      <div className="container">
        <div className="blog-grid fade-up">
          {ARTICLES.map(a => (
            <article key={a.id} className="blog-card">
              <div className="blog-card-img">{a.emoji}</div>
              <div className="blog-card-body">
                <p className="blog-cat">{a.cat}</p>
                <h3>{a.title}</h3>
                <p>{a.preview}</p>
                <button
                  className="read-more"
                  onClick={() => setSelected(a)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                >
                  Толығырақ оқу →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selected && (
        <div
          onClick={e => e.target === e.currentTarget && setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', backdropFilter: 'blur(6px)',
            animation: 'modalBgIn 0.25s ease'
          }}
        >
          <style>{`
            @keyframes modalBgIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes modalSlideIn { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
          `}</style>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '20px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
            animation: 'modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'
          }}>
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--surface2)', border: 'none', borderRadius: '50%',
                width: '34px', height: '34px', cursor: 'pointer',
                fontSize: '16px', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{selected.emoji}</div>
            <span style={{ fontSize: '12px', color: '#0891b2', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.cat}</span>
            <h2 style={{ margin: '8px 0 20px', fontSize: '22px', color: 'var(--text)' }}>{selected.title}</h2>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.9 }}>
              {selected.full.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} style={{ fontWeight: 700, color: 'var(--text)', margin: '14px 0 4px', fontSize: '15px' }}>{line.slice(2, -2)}</p>;
                }
                if (line.startsWith('- ')) {
                  return <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}><span style={{ color: '#0891b2', flexShrink: 0 }}>•</span><span>{line.slice(2)}</span></div>;
                }
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return <p key={i} style={{ margin: '2px 0' }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text)' }}>{p}</strong> : p)}</p>;
              })}
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: '28px', padding: '10px 24px',
                background: '#0891b2', color: 'white',
                border: 'none', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 600, fontSize: '14px'
              }}
            >Жабу</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
