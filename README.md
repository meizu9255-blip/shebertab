# SheberTab — Жергілікті Маман Табу Платформасы 🔧

> Клиенттер мен мамандарды байланыстыратын fullstack веб-платформа.

## 🌐 Тікелей сілтемелер

| | Сілтеме |
|-|---------|
| 🌍 **Сайт** | https://shebertab.onrender.com |
| ⚙️ **API** | https://shebertab-backend.onrender.com |
| 📂 **GitHub** | https://github.com/meizu9255-blip/shebertab |

---

## 🛠️ Технологиялар

| Бөлім | Стек |
|-------|------|
| **Frontend** | React.js, Vite, CSS Variables |
| **Backend** | Node.js, Express.js |
| **Дерекқор** | PostgreSQL |
| **Аутентификация** | JWT, Passport.js, Google OAuth |
| **Нақты уақыт** | Socket.io (WebSocket) |
| **Хостинг** | Render.com |

---

## 📁 Жоба құрылымы

```
Shebertab/
├── shebertab-backend/       ← Node.js Backend
│   ├── routes/              ← API маршруттары
│   │   ├── auth.js          ← Аутентификация
│   │   ├── workers.js       ← Мамандар
│   │   ├── orders.js        ← Тапсырыстар
│   │   ├── messages.js      ← Хабарламалар
│   │   ├── notifications.js ← Хабарландырулар
│   │   ├── services.js      ← Қызмет категориялары
│   │   └── admin.js         ← Админ панель
│   ├── middleware/
│   │   └── authMiddleware.js← JWT тексеру
│   ├── config/
│   │   └── passport.js      ← OAuth стратегиялар
│   ├── sql/
│   │   └── schema.sql       ← Дерекқор схемасы
│   ├── db.js                ← PostgreSQL байланыс + seed
│   ├── server.js            ← Негізгі сервер + Socket.io
│   ├── .env.example         ← Айнымалылар үлгісі
│   └── package.json
│
├── shebertab-react/         ← React Frontend
│   ├── src/
│   │   ├── components/      ← Ортақ компоненттер
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ServiceList.jsx
│   │   │   └── FilterHeader.jsx
│   │   ├── pages/           ← Беттер
│   │   │   ├── Home.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── config.js        ← API URL орталықтандыру
│   │   └── index.css        ← Глобал стильдер
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✅ Орындалған функционалдар

- 🔐 Email/пароль арқылы тіркелу және кіру
- 🔑 Google OAuth арқылы кіру
- 🔄 Пароль қалпына келтіру (email арқылы)
- 👤 Профиль редактирлеу
- 🔧 Маман тіркелу және профиль жасау
- 🔍 Мамандарды іздеу және фильтрлеу
- 📦 Тапсырыс беру және күйін қадағалау
- ⭐ Рейтинг беру жүйесі
- 💬 Нақты уақыт чат (Socket.io)
- 🔔 Нақты уақыт хабарландыру (Socket.io)
- 🛡️ Рөлге негізделген қолжетімділік (admin / worker / client)
- 📊 Админ панель (пайдаланушылар, мамандар, категориялар)

---

## 🚀 Локалды іске қосу

### Талаптар
- Node.js v18+
- PostgreSQL 14+

### Backend
```bash
cd shebertab-backend
npm install
cp .env.example .env   # .env толтырыңыз
node server.js
```

### Frontend
```bash
cd shebertab-react
npm install
npm run dev
```

---

## 🔐 Қауіпсіздік

- JWT токен аутентификациясы
- bcrypt пароль хэштеу
- CORS тек рұқсат етілген доменге
- Құпия кілттер тек `.env` файлда (gitignore-да)

---

**Автор:** Әлімбек Бексұлтан  
© 2026 SheberTab
