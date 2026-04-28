# Практикалық жұмыс №6
## Жобаны сынақ серверіне орналастыру

**Жоба атауы:** SheberTab — Жергілікті маман табу платформасы  
**Студент:** Әлімбек Бексұлтан  
**Күні:** 28.04.2026  

---

## 1. Жоба туралы жалпы ақпарат

| Параметр | Мәні |
|----------|------|
| Жоба атауы | SheberTab |
| Жоба тақырыбы | Жергілікті қызмет табу платформасы |
| Сервер | Render.com (Free tier) |
| Frontend URL | https://shebertab.onrender.com |
| Backend URL | https://shebertab-backend.onrender.com |
| Git репозиторий | https://github.com/meizu9255-blip/shebertab |
| Мәліметтер базасы | PostgreSQL (Render managed) |
| Backend Runtime | Node.js |
| Frontend | React.js (Static Site) |

---

## 2. Қолданылған технологиялар

| Бөлім | Технология |
|-------|-----------|
| Frontend | React.js, Vite, CSS Variables |
| Backend | Node.js, Express.js |
| Дерекқор | PostgreSQL |
| Аутентификация | JWT (JSON Web Token), Passport.js |
| Нақты уақыт | Socket.io (WebSocket) |
| OAuth | Google OAuth 2.0 |
| CI/CD | GitHub → Render Auto-deploy |
| Хостинг | Render.com |

---

## 3. Дайындық кезеңі

### 3.1. Міндетті файлдар тізімі

| Файл | Күйі |
|------|------|
| `README.md` | ✅ Бар |
| `.gitignore` | ✅ Бар (`.env`, `node_modules` жасырылған) |
| `package.json` (backend) | ✅ Бар |
| `package.json` (frontend) | ✅ Бар |
| `.env.example` | ✅ Render Environment Variables арқылы |
| SQL schema файлы | ✅ `shebertab-backend/sql/schema.sql` |
| `src/config.js` | ✅ `VITE_API_URL` айнымалысы арқылы |

### 3.2. .gitignore мазмұны
```
.env
node_modules/
```

### 3.3. src/config.js (орталықтандырылған URL)
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_URL;
```
> Барлық `fetch` сұраныстары `http://localhost:5000` орнына осы айнымалыны қолданады. Деплой кезінде Render-дегі URL автоматты орнатылады.

---

## 4. Сервер баптауы

### 4.1. Render.com таңдалу себебі
- Тегін PostgreSQL базасы
- Node.js автоматты деплой
- GitHub интеграциясы
- Environment Variables қолдауы
- Логтарды нақты уақытта көру

### 4.2. Орналастырылған сервистер

**Backend (Web Service):**
- Runtime: Node.js
- Build Command: `npm install`
- Start Command: `node server.js`
- Region: Oregon

**Frontend (Static Site):**
- Build Command: `npm run build`
- Publish Directory: `dist`
- Region: Global (CDN)

**Database (PostgreSQL):**
- Plan: Free
- Region: Oregon (Backend-пен бір аймақта)

### 4.3. Environment Variables (Backend)

| KEY | Мақсаты |
|-----|---------|
| `DATABASE_URL` | PostgreSQL байланыс сілтемесі |
| `JWT_SECRET` | Token шифрлау кілті |
| `FRONTEND_URL` | CORS үшін фронтенд адресі |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL |

### 4.4. Environment Variables (Frontend)

| KEY | Мәні |
|-----|------|
| `VITE_API_URL` | `https://shebertab-backend.onrender.com` |

---

## 5. Мәліметтер базасын серверге көшіру

### 5.1. Дерекқор кестелері
`db.js` файлы сервер іске қосылғанда автоматты кестелер жасайды:

```javascript
// Хабарландырулар кестесі
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// Хабарламалар кестесі
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  message_text TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2. Бастапқы деректер (Seed Data)
Сервер іске қосылғанда автоматты:
- 6 тесттік маман пайдаланушы жасалады
- 4 қызмет категориясы қосылады
- Админ аккаунты жасалады: `admin@shebertab.kz / admin123`

### 5.3. База байланысын тексеру
```
PostgreSQL дерекқорына сәтті қосылды
Базаға қызмет түрлері (services) сәтті қосылды!
Базаға барлық 6 тесттік мамандар (workers) сәтті қосылды!
Админ аккаунты құрылды: admin@shebertab.kz / admin123
```

---

## 6. REST API Endpoint-тер тексеруі

### 6.1. Аутентификация API
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/auth/register` | POST | Тіркелу | ✅ |
| `/api/auth/login` | POST | Кіру | ✅ |
| `/api/auth/me` | GET | Ағымдағы пайдаланушы | ✅ |
| `/api/auth/profile` | PUT | Профиль жаңарту | ✅ |
| `/api/auth/password` | PUT | Пароль өзгерту | ✅ |
| `/api/auth/google` | GET | Google OAuth | ✅ |
| `/api/auth/forgot-password` | POST | Пароль қалпына келтіру | ✅ |

### 6.2. Мамандар API
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/workers` | GET | Барлық мамандар | ✅ |
| `/api/workers` | POST | Маман тіркеу | ✅ |
| `/api/workers/:id/rating` | PUT | Рейтинг беру | ✅ |
| `/api/workers/:id` | DELETE | Маманды жою | ✅ |

### 6.3. Тапсырыстар API
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/orders` | POST | Тапсырыс жасау | ✅ |
| `/api/orders/:userId` | GET | Пайдаланушы тапсырыстары | ✅ |
| `/api/orders/:id/status` | PUT | Күйін өзгерту | ✅ |

### 6.4. Хабарламалар API
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/messages` | POST | Хабарлама жіберу | ✅ |
| `/api/messages/contacts` | GET | Контактілер тізімі | ✅ |
| `/api/messages/:userId` | GET | Чат тарихы | ✅ |

### 6.5. Хабарландырулар API (WebSocket)
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/notifications` | GET | Барлық хабарландырулар | ✅ |
| `/api/notifications/:id/read` | PATCH | Оқылды деп белгілеу | ✅ |
| `socket.on('join')` | WS | Бөлмеге кіру | ✅ |
| `socket.emit('new_notification')` | WS | Хабарлама жіберу | ✅ |

### 6.6. Админ API
| Endpoint | Метод | Сипаттама | Күйі |
|----------|-------|-----------|------|
| `/api/admin/users` | GET | Пайдаланушылар тізімі | ✅ |
| `/api/admin/workers` | GET | Мамандар тізімі | ✅ |
| `/api/admin/users/:id/role` | PUT | Рөл өзгерту | ✅ |
| `/api/admin/services` | POST | Категория қосу | ✅ |
| `/api/admin/services/:id` | PUT | Категория өзгерту | ✅ |
| `/api/admin/services/:id` | DELETE | Категория жою | ✅ |

---

## 7. Тексерілген функционалдар (№3 тақырып)

### 7.1. Клиент және маман ретінде тіркелу
- Email/пароль арқылы тіркелу — ✅
- Google OAuth арқылы кіру — ✅
- JWT токен арқылы сессия — ✅
- Профиль → Маман профилі бөліміне өтіп маман тіркелу — ✅

### 7.2. Маман профилін жасау
- Профиль бетінен қызмет түрін, бағасын, орындау уақытын толтыру — ✅
- Серверге POST `/api/workers` арқылы жіберу — ✅

### 7.3. Қызмет түрі бойынша іздеу және фильтр
- Мамандар бетінде іздеу жолағы — ✅
- Категория бойынша фильтр — ✅
- Фильтр динамикалық, бетті жаңартпай жұмыс істейді — ✅

### 7.4. Рейтинг және пікір қалдыру
- Аяқталған тапсырыстан кейін жұлдызша рейтинг беру — ✅
- `is_rated` өрісі қайталап бағалауды болдырмайды — ✅

### 7.5. Клиенттің өтінім жіберуі
- Маман профилінен тапсырыс беру — ✅
- Тапсырыс «Менің тапсырыстарым» бетінде көрінеді — ✅

### 7.6. Маманға notification (хабарландыру) келуі
- Жаңа тапсырыс келгенде маманға Socket.io арқылы нақты уақытта хабарландыру — ✅
- Navbar-да оқылмаған хабарландыру санашығы — ✅

### 7.7. Админнің қызмет категорияларын басқаруы
- Категория қосу, өзгерту, жою — ✅
- Рөлге негізделген қолжетімділік (тек admin) — ✅

---

## 8. Қауіпсіздік конфигурациясы

| Талап | Іске асырылуы |
|-------|--------------|
| Құпия кілттер репозиторийде жоқ | ✅ `.env` gitignore-да |
| JWT арқылы аутентификация | ✅ `verifyToken` middleware |
| CORS баптауы | ✅ тек `FRONTEND_URL`-ге рұқсат |
| Пароль хэштелген | ✅ bcrypt (10 rounds) |
| Рөлге негізделген қолжетімділік | ✅ admin/worker/client рөлдері |
| Басқа пайдаланушы деректерін өзгертуге тыйым | ✅ token-дан id тексеріледі |

---

## 9. Қате журналы

| № | Қате сипаттамасы | Себебі | Шешімі | Күйі |
|---|-----------------|--------|--------|------|
| 1 | `git push` блокталды | `.env` файлы GitHub-қа жүктелді | `git rm --cached .env`, `.gitignore` жаңартылды | ✅ Түзетілді |
| 2 | Internal Server Error | `DATABASE_URL` env жоқ | Render-ге `DATABASE_URL` қосылды | ✅ Түзетілді |
| 3 | CORS қатесі | `FRONTEND_URL` дұрыс орнатылмаған | Backend env-ке Render frontend URL қосылды | ✅ Түзетілді |
| 4 | API `localhost:5000` деп тұрды | Hardcoded URL | `config.js` арқылы `VITE_API_URL` айнымалысы | ✅ Түзетілді |
| 5 | Socket.io қосылмады | Hardcoded socket URL | `io(API_URL)` — config-тен оқылатын болды | ✅ Түзетілді |

---

## 10. Тестілеу нәтижесі

| Тест | Нәтиже |
|------|--------|
| Тіркелу (email) | ✅ Өтті |
| Кіру (email/пароль) | ✅ Өтті |
| Google OAuth | ✅ Өтті |
| Маман тізімін көру | ✅ Өтті |
| Тапсырыс беру | ✅ Өтті |
| Тапсырыс күйін өзгерту | ✅ Өтті |
| Рейтинг беру | ✅ Өтті |
| Хабарлама жіберу (чат) | ✅ Өтті |
| Нақты уақыт хабарландыру | ✅ Өтті |
| Админ панель (CRUD) | ✅ Өтті |
| Категория басқару | ✅ Өтті |
| Мобильді экранда ашылу | ✅ Өтті |
| Рөлге негізделген қолжетімділік | ✅ Өтті |
| CSS/статикалық файлдар | ✅ Өтті |

---

## 11. Қорытынды

SheberTab жобасы Render.com платформасына сәтті орналастырылды. Жоба толықтай жұмыс режимінде:
- **Frontend** `https://shebertab.onrender.com` адресінде Static Site ретінде жұмыс істейді
- **Backend** `https://shebertab-backend.onrender.com` адресінде Node.js Web Service ретінде жұмыс істейді
- **PostgreSQL** базасы Render-де орналасқан және автоматты инициализацияланады
- **Socket.io** WebSocket байланысы нақты уақыт хабарландырулары мен чат үшін жұмыс істейді
- Барлық **REST API** endpoint-тері JSON форматында дұрыс жауап береді
- **Қауіпсіздік** талаптары сақталған: JWT, bcrypt, CORS, рөлдік жүйе

Деплой барысында 5 қате анықталды және барлығы сәтті түзетілді.

---
**Жоба сілтемесі:** https://shebertab.onrender.com  
**GitHub:** https://github.com/meizu9255-blip/shebertab
