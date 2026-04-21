import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  Zap,
  CheckCircle,
  ChevronDown,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Check,
  ArrowRight,
  Sparkles,
  Building2,
  Wrench,
  Heart
} from 'lucide-react';

const LocalServices = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite 2s; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
        .gradient-text {
          background: linear-gradient(135deg, #f97316 0%, #eab308 50%, #f97316 100%);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 40px rgba(249, 115, 22, 0.15);
        }
        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(249, 115, 22, 0.5);
        }
        .btn-ghost {
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(249, 115, 22, 0.5);
          background: rgba(249, 115, 22, 0.1);
        }
        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .nav-blur {
          background: rgba(8, 8, 15, 0.8);
          backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-blur border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TabuService</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              {['Басты', 'Мүмкіндіктер', 'Бағалар', 'Пікірлер', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Кіру</button>
              <button className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold">
                Бастау
              </button>
            </div>

            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden nav-blur border-t border-white/5 animate-slideIn">
            <div className="px-4 py-6 space-y-4">
              {['Басты', 'Мүмкіндіктер', 'Бағалар', 'Пікірлер', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-300 hover:text-white py-2">
                  {item}
                </a>
              ))}
              <button className="btn-primary w-full py-3 rounded-lg font-semibold mt-4">
                Бастау
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]" />
          
          {/* Floating elements */}
          <div className="absolute top-32 left-[15%] w-16 h-16 glass-card rounded-2xl animate-float flex items-center justify-center">
            <Wrench className="w-8 h-8 text-orange-400" />
          </div>
          <div className="absolute top-48 right-[20%] w-14 h-14 glass-card rounded-xl animate-float-delayed flex items-center justify-center">
            <Building2 className="w-7 h-7 text-amber-400" />
          </div>
          <div className="absolute bottom-32 left-[25%] w-12 h-12 glass-card rounded-lg animate-float flex items-center justify-center" style={{ animationDelay: '1s' }}>
            <Heart className="w-6 h-6 text-orange-300" />
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">№1 жергілікті қызмет платформасы</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <span className="text-white">Жергілікті қызметтерді</span>
            <br />
            <span className="gradient-text">оңай табыңыз</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            Сіздің аймағыңыздағы ең жақсы шеберлерді, қызметтерді және кәсіби мамандарды бірнеше секундта табыңыз
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
              Қызмет табу
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-ghost px-8 py-4 rounded-xl text-lg font-medium w-full sm:w-auto">
              Қалай жұмыс істейді
            </button>
          </div>

          {/* Search Preview */}
          <div className="mt-16 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Қандай қызмет керек? (мысалы: сантехник, электрик...)"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
                <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
                  Іздеу
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <PricingSection billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod} />

      {/* FAQ */}
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

const AnimatedCounter = ({ value, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const FeaturesSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const features = [
    { icon: Search, title: 'Жылдам іздеу', desc: 'Сізге керек қызметті бірнеше секундта табыңыз' },
    { icon: Shield, title: 'Тексерілген шеберлер', desc: 'Барлық мамандар тексеруден өткен' },
    { icon: Star, title: 'Шынайы бағалар', desc: 'Нақты клиенттердің пікірлері мен рейтингтері' },
    { icon: Clock, title: '24/7 қолдау', desc: 'Тәулік бойы көмек алу мүмкіндігі' },
    { icon: MapPin, title: 'Жақын орналасу', desc: 'Сіздің аймағыңыздағы мамандар' },
    { icon: Zap, title: 'Тез жауап', desc: 'Орташа жауап беру уақыты - 15 минут' },
  ];

  return (
    <section id="мүмкіндіктер" className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Неліктен <span className="gradient-text">TabuService</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Біздің платформа жергілікті қызметтерді табуды оңай әрі қауіпсіз етеді
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const stats = [
    { value: 50000, suffix: '+', label: 'Тіркелген шеберлер' },
    { value: 120, suffix: 'K+', label: 'Орындалған тапсырыстар' },
    { value: 98, suffix: '%', label: 'Қанағаттанған клиенттер' },
    { value: 45, suffix: '+', label: 'Қызмет категориялары' },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5" />
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const steps = [
    { icon: Search, title: 'Қызметті табыңыз', desc: 'Іздеу жолағына қажетті қызметті енгізіңіз' },
    { icon: Users, title: 'Шеберді таңдаңыз', desc: 'Рейтинг пен бағаны салыстырып, ең жақсысын таңдаңыз' },
    { icon: CheckCircle, title: 'Тапсырыс беріңіз', desc: 'Байланысыңыз және жұмысты бастаңыз' },
  ];

  return (
    <section className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Қалай <span className="gradient-text">жұмыс істейді</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Үш қарапайым қадаммен қажетті қызметті табыңыз
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block w-24 h-0.5 bg-gradient-to-r from-orange-500/50 to-amber-500/50" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const testimonials = [
    { name: 'Айгүл М.', role: 'Үй иесі', text: 'Тамаша платформа! Сантехникті 10 минутта таптым. Жұмысын керемет орындады.', rating: 5 },
    { name: 'Бауыржан К.', role: 'Кәсіпкер', text: 'Офис жөндеу үшін шеберлер таптым. Бағасы қолайлы, сапасы жоғары.', rating: 5 },
    { name: 'Динара С.', role: 'Студент', text: 'Ноутбукты жөндету қажет болды. Бір сағатта маман келіп, мәселені шешті.', rating: 4 },
  ];

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

  return (
    <section id="пікірлер" className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Клиенттер <span className="gradient-text">не айтады</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Мыңдаған қанағаттанған клиенттердің пікірлері
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={item.name}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03]"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold">
                  {getInitials(item.name)}
                </div>
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-gray-300">{`"${item.text}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = ({ billingPeriod, setBillingPeriod }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const plans = [
    { 
      name: 'Бастаушы', 
      price: { monthly: 0, yearly: 0 }, 
      features: ['Ай сайын 5 тапсырыс', 'Негізгі іздеу', 'Email қолдау'],
      popular: false 
    },
    { 
      name: 'Кәсіби', 
      price: { monthly: 4990, yearly: 3990 }, 
      features: ['Шексіз тапсырыстар', 'Кеңейтілген іздеу', 'Приоритетті қолдау', 'Аналитика', 'API қолжетімділік'],
      popular: true 
    },
    { 
      name: 'Бизнес', 
      price: { monthly: 14990, yearly: 11990 }, 
      features: ['Барлық Кәсіби мүмкіндіктер', 'Арнайы менеджер', 'Кастом интеграция', 'SLA кепілдік', 'Топтық аккаунттар'],
      popular: false 
    },
  ];

  return (
    <section id="бағалар" className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Қарапайым <span className="gradient-text">баға жоспарлары</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Сіздің қажеттіліктеріңізге сәйкес жоспарды таңдаңыз
          </p>

          <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-white/5">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-gray-400'}`}
            >
              Ай сайын
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'yearly' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-gray-400'}`}
            >
              Жыл сайын
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] ${plan.popular ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50 scale-105' : 'glass-card'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-semibold mb-4">
                  Танымал
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price[billingPeriod].toLocaleString()}</span>
                <span className="text-gray-400"> ₸/ай</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}>
                Бастау
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = ({ openFaq, setOpenFaq }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const faqs = [
    { q: 'TabuService қалай жұмыс істейді?', a: 'Сіз қажетті қызметті іздеу жолағына енгізесіз, біз сізге жақын орналасқан тексерілген шеберлердің тізімін көрсетеміз. Рейтинг пен бағаны салыстырып, өзіңізге ыңғайлысын таңдай аласыз.' },
    { q: 'Шеберлер қалай тексеріледі?', a: 'Барлық шеберлер жеке басын куәландыратын құжаттарды тапсырады, біз олардың біліктілігін және жұмыс тәжірибесін тексереміз. Сондай-ақ, клиенттердің пікірлері үнемі қадағаланады.' },
    { q: 'Төлем қалай жүзеге асырылады?', a: 'Төлем шебермен келісілген бағамен тікелей жүргізіледі. Біздің платформа қызмет ақысын алмайды - бұл тек шеберлер үшін жазылым негізінде жұмыс істейді.' },
    { q: 'Егер жұмыс сапасы қанағаттандырмаса не істеймін?', a: 'Біздің қолдау командасы 24/7 жұмыс істейді. Кез келген мәселе туындаса, бізге хабарласыңыз - біз шеберлермен байланысып, мәселені шешуге көмектесеміз.' },
    { q: 'Қызметтің жұмыс уақыты қандай?', a: 'Платформа тәулік бойы жұмыс істейді. Шеберлер өз жұмыс кестелерін өздері белгілейді, сондықтан түнгі немесе демалыс күндері де қызмет табу мүмкіндігі бар.' },
    { q: 'Шебер болып тіркелу қалай?', a: 'Шебер болу үшін тіркеу формасын толтырып, құжаттарыңызды жүктеңіз. Тексеруден өткеннен кейін (әдетте 24-48 сағат) сіз тапсырыстар қабылдай бастайсыз.' },
  ];

  return (
    <section id="faq" className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Жиі <span className="gradient-text">қойылатын сұрақтар</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ең көп қойылатын сұрақтарға жауаптар
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-orange-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-48 pb-5' : 'max-h-0'}`}>
                <p className="px-5 text-gray-400">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTABanner = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section className="py-24 px-4">
      <div 
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          <div className="relative z-10 py-16 px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Бүгін бастаңыз
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Жаңалықтар мен арнайы ұсыныстардан хабардар болу үшін жазылыңыз
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email мекенжайыңыз"
                className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 outline-none placeholder-white/60 text-white"
              />
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-orange-600 font-semibold hover:bg-white/90 transition-all">
                Жазылу
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const footerLinks = {
    'Платформа': ['Қызметтер', 'Бағалар', 'Шеберлер', 'Блог'],
    'Компания': ['Біз туралы', 'Карьера', 'Серіктестік', 'Баспасөз'],
    'Қолдау': ['Анықтама', 'Байланыс', 'API', 'Статус'],
    'Құқықтық': ['Құпиялылық', 'Шарттар', 'Cookies', 'Лицензиялар'],
  };

  return (
    <footer className="border-t border-white/5 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TabuService</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Қазақстандағы ең үлкен жергілікті қызметтерді табу платформасы. Сенімді шеберлер - бір кликте.
            </p>
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 TabuService. Барлық құқықтар қорғалған.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Құпиялылық саясаты</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Пайдалану шарттары</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LocalServices;
