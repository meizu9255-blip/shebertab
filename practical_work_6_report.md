# Практикалық жұмыс №6
## Жобаны сынақ серверіне орналастыру

**Жоба атауы:** SheberTab — Жергілікті маман табу платформасы  
**Студент:** Әлімбек Бексұлтан  
**Күні:** 28.04.2026  
**Тақырып:** №3 — Жергілікті қызмет табу платформасы

---

## 1. Жоба туралы жалпы ақпарат

| Параметр | Мәні |
|----------|------|
| Жоба атауы | SheberTab |
| Сервер | Render.com |
| Frontend URL | https://shebertab.onrender.com |
| Backend URL | https://shebertab-backend.onrender.com |
| Git репозиторий | https://github.com/meizu9255-blip/shebertab |
| Мәліметтер базасы | PostgreSQL (Render Managed) |
| Backend Runtime | Node.js (Express.js) |
| Frontend | React.js (Vite, Static Site) |

---

## 2. Қолданылған технологиялар

| Бөлім | Технология |
|-------|-----------|
| Frontend | React.js, Vite, CSS Variables, Socket.io-client |
| Backend | Node.js, Express.js |
| Дерекқор | PostgreSQL |
| Аутентификация | JWT (JSON Web Token), bcrypt |
| Нақты уақыт | Socket.io (WebSocket) |
| Email | Nodemailer (Gmail SMTP) |
| Хостинг | Render.com (Free tier) |
| CI/CD | GitHub → Render Auto-deploy |

---

## 3. Дайындық кезеңі

### 3.1. Міндетті файлдар

| Файл | Күйі | Сипаттама |
|------|------|-----------|
| `README.md` | ✅ | Жоба туралы толық сипаттама |
| `.gitignore` | ✅ | `.env`, `node_modules`, `dist` жасырылған |
| `.env.example` | ✅ | Барлық айнымалылар үлгісі |
| `package.json` (backend) | ✅ | Node.js тәуелділіктер |
| `package.json` (frontend) | ✅ | React тәуелділіктер |
| `sql/schema.sql` | ✅ | Дерекқор схемасы |
| `src/config.js` | ✅ | Орталықтандырылған API URL |

### 3.2. Жоба тазалау кезінде орындалған әрекеттер

- Пайдаланылмайтын `passport-apple` зависимость алынды
- Apple OAuth коды алынды
- Google OAuth, GitHub OAuth батырмалары алынды (тек email auth қалды)
- `replace_urls.js` уақытша скрипт тазаланды
- `.env` файл `.gitignore`-ға қосылды
- Барлық `http://localhost:5000` → `${API_URL}` ауыстырылды

### 3.3. src/config.js

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_URL;
```

---

## 4. Сервер баптауы — Render.com

### 4.1. Render таңдалу себебі

| Критерий | Render |
|----------|--------|
| Тегін PostgreSQL | ✅ |
| Node.js деплой | ✅ |
| GitHub Auto-deploy | ✅ |
| Environment Variables | ✅ |
| Нақты уақыт логтар | ✅ |
| Сыртқы URL | ✅ |

### 4.2. Орналастырылған сервистер

**Backend — Web Service:**
- Runtime: Node.js
- Build Command: `npm install`
- Start Command: `node server.js`
- Region: Oregon (US West)

**Frontend — Static Site:**
- Build Command: `npm run build`
- Publish Directory: `dist`
- Region: Global (CDN)

**Database — PostgreSQL:**
- Type: Render Managed PostgreSQL
- Region: Oregon (Backend-пен бір аймақ)

### 4.3. Environment Variables

**Backend:**

| KEY | Мақсаты |
|-----|---------|
| `DATABASE_URL` | Render PostgreSQL байланыс URL |
| `JWT_SECRET` | Token шифрлау |
| `FRONTEND_URL` | CORS рұқсаты |
| `SMTP_USER` | Email жіберу |
| `SMTP_PASS` | Gmail App Password |

**Frontend:**

| KEY | Мәні |
|-----|------|
| `VITE_API_URL` | `https://shebertab-backend.onrender.com` |

---

## 5. Мәліметтер базасын серверге көшіру

### 5.1. Автоматты инициализация

`db.js` файлы сервер іске қосылғанда автоматты:

```javascript
// 1. Кестелер жасалады
CREATE TABLE IF NOT EXISTS users (...);
CREATE TABLE IF NOT EXISTS services (...);
CREATE TABLE IF NOT EXISTS workers (...);
CREATE TABLE IF NOT EXISTS orders (...);
CREATE TABLE IF NOT EXISTS notifications (...);
CREATE TABLE IF NOT EXISTS messages (...);

// 2. Seed деректер қосылады
// - 4 қызмет категориясы
// - 6 тесттік маман
// - 1 Admin аккаунты
```

### 5.2. Render PostgreSQL-ға pgAdmin арқылы қосылу

- **Host:** `dpg-xxxxx.oregon-postgres.render.com` (External)
- **Port:** `5432`
- **SSL Mode:** `require`
- **Database/User:** Render "Connections" бетінен алынды

### 5.3. Нәтиже

Сервердегі базада деректер сәтті тексерілді:
- `users` кестесінде тіркелген пайдаланушылар бар
- `services` кестесінде 4 категория бар
- `workers` кестесінде 6 маман бар

---

## 6. Статикалық файлдарды баптау

| Тексеріс | Нәтиже |
|----------|--------|
| CSS стильдер | ✅ Жүктеледі |
| JavaScript файлдары | ✅ Жүктеледі |
| Иконкалар (SVG) | ✅ Көрінеді |
| Шрифттер (Google Fonts) | ✅ Жүктеледі |
| Браузер Console қатесі | ✅ Жоқ |

React Vite `npm run build` барлық статикалық файлдарды `dist/` папкасына жинайды. Render Static Site `dist/` папкасын CDN арқылы таратады.

---

## 7. REST API Endpoint-тер тексеруі

### 7.1. Аутентификация

| Endpoint | Метод | Status | Нәтиже |
|----------|-------|--------|--------|
| `/api/auth/register` | POST | 201 | ✅ |
| `/api/auth/login` | POST | 200 | ✅ |
| `/api/auth/me` | GET | 200/401 | ✅ |
| `/api/auth/profile` | PUT | 200 | ✅ |
| `/api/auth/forgot-password` | POST | 200 | ✅ |
| `/api/auth/reset-password/:id/:token` | POST | 200 | ✅ |

### 7.2. Мамандар

| Endpoint | Метод | Status | Нәтиже |
|----------|-------|--------|--------|
| `/api/workers` | GET | 200 | ✅ |
| `/api/workers` | POST | 201 | ✅ |
| `/api/workers/:id/rating` | PUT | 200 | ✅ |
| `/api/workers/:id` | DELETE | 200 | ✅ |

### 7.3. Тапсырыстар

| Endpoint | Метод | Status | Нәтиже |
|----------|-------|--------|--------|
| `/api/orders` | POST | 201 | ✅ |
| `/api/orders/:userId` | GET | 200 | ✅ |
| `/api/orders/:id/status` | PUT | 200 | ✅ |

### 7.4. Хабарламалар (Chat)

| Endpoint | Метод | Status | Нәтиже |
|----------|-------|--------|--------|
| `/api/messages` | POST | 201 | ✅ |
| `/api/messages/contacts` | GET | 200 | ✅ |
| `/api/messages/:userId` | GET | 200 | ✅ |

### 7.5. Хабарландырулар (Socket.io)

| Endpoint/Event | Нәтиже |
|----------------|--------|
| `GET /api/notifications` | ✅ |
| `PATCH /api/notifications/:id/read` | ✅ |
| `socket.on('join')` | ✅ |
| `socket.emit('new_notification')` | ✅ |

### 7.6. Админ панель

| Endpoint | Метод | Status | Нәтиже |
|----------|-------|--------|--------|
| `/api/admin/users` | GET | 200 | ✅ |
| `/api/admin/workers` | GET | 200 | ✅ |
| `/api/admin/users/:id/role` | PUT | 200 | ✅ |
| `/api/admin/users/:id` | DELETE | 200 | ✅ |
| `/api/admin/services` | POST | 201 | ✅ |
| `/api/admin/services/:id` | PUT | 200 | ✅ |
| `/api/admin/services/:id` | DELETE | 200 | ✅ |

---

## 8. №3 Тақырып бойынша функционалдар тексеруі

| Функционал | Тексеріс | Нәтиже |
|-----------|----------|--------|
| Email арқылы тіркелу | Жаңа email, пароль енгізіп тіркелу | ✅ |
| Email арқылы кіру | Тіркелген email/пароль | ✅ |
| Профиль редактирлеу | Аты-жөні, телефон өзгерту | ✅ |
| Маман профилін жасау | Профиль → маман тіркеу формасы | ✅ |
| Қызмет категориясы бойынша іздеу | Фильтр dropdown | ✅ |
| Аты бойынша іздеу | Search input | ✅ |
| Тапсырыс беру | Маман картасынан тапсырыс | ✅ |
| Тапсырыс күйін өзгерту | accepted/completed/rejected | ✅ |
| Рейтинг беру | Аяқталған тапсырыстан жұлдыз | ✅ |
| Нақты уақыт хабарландыру | Socket.io push notification | ✅ |
| Чат жіберу | Messages беті | ✅ |
| Рөлге негізделген қол жетімділік | Admin тек admin көреді | ✅ |
| Категория қосу (Admin) | AdminPanel → + батырмасы | ✅ |
| Категория өзгерту (Admin) | ✏️ батырмасы | ✅ |
| Категория жою (Admin) | 🗑️ батырмасы | ✅ |
| Пайдаланушы рөлін өзгерту (Admin) | Dropdown | ✅ |
| Пароль қалпына келтіру | Email арқылы сілтеме | ✅ |
| Мобильді экранда ашылу | 375px экранда | ✅ |

---

## 9. Қауіпсіздік конфигурациясы

| Талап | Іске асырылуы |
|-------|--------------|
| `.env` gitignore-да | ✅ |
| JWT аутентификация | ✅ `verifyToken` middleware |
| bcrypt пароль хэштеу | ✅ 10 rounds |
| CORS тек рұқсат берілген домен | ✅ `FRONTEND_URL` env |
| Рөлге негізделген қолжетімділік | ✅ admin/worker/client |
| Basқа пайдаланушы деректерін өзгертуге тыйым | ✅ token-дан id тексеріледі |
| Debug режимі өшірілген | ✅ Render production mode |

---

## 10. Қате журналы

| № | Қате сипаттамасы | Себебі | Шешімі | Күйі |
|---|-----------------|--------|--------|------|
| 1 | `git push` блокталды | `.env` файлы секреттермен GitHub-қа жүктелді | `git rm --cached .env`, `.gitignore` жаңартылды, `git push --force` | ✅ Түзетілді |
| 2 | `500 Internal Server Error` (login) | Render базасында кестелер жоқ болды | `db.js` жаңартылды: `CREATE TABLE IF NOT EXISTS` алдымен орындалады | ✅ Түзетілді |
| 3 | CORS қатесі | `FRONTEND_URL` env орнатылмаған | Render backend-ке `FRONTEND_URL` қосылды | ✅ Түзетілді |
| 4 | Барлық fetch `localhost:5000` деп тұрды | Hardcoded URL | `config.js` арқылы `VITE_API_URL` айнымалысы енгізілді | ✅ Түзетілді |
| 5 | pgAdmin External байланыс қатесі | Internal hostname қолданылды | External hostname (`.oregon-postgres.render.com`) + SSL `require` | ✅ Түзетілді |
| 6 | Google OAuth жұмыс істемеді | Render callback URL Google Console-да тіркелмеген | Google OAuth толық алынды, тек email/пароль қалды | ✅ Түзетілді |

---

## 11. Тестілеу нәтижесі

| Тест | Нәтиже |
|------|--------|
| Тіркелу (email/пароль) | ✅ Өтті |
| Кіру (email/пароль) | ✅ Өтті |
| Жаңа пайдаланушы базада сақталуы | ✅ pgAdmin арқылы тексерілді |
| Маман тізімін көру | ✅ Өтті |
| Категория бойынша фильтрлеу | ✅ Өтті |
| Тапсырыс беру | ✅ Өтті |
| Тапсырыс күйін өзгерту | ✅ Өтті |
| Рейтинг беру | ✅ Өтті |
| Хабарлама жіберу (чат) | ✅ Өтті |
| Нақты уақыт хабарландыру | ✅ Өтті |
| Adminpanel — категория CRUD | ✅ Өтті |
| AdminPanel — пайдаланушы рөлі | ✅ Өтті |
| Пароль қалпына келтіру (email) | ✅ Өтті |
| CSS/статикалық файлдар | ✅ Өтті |
| Мобильді экранда ашылу | ✅ Өтті |
| Авторизациясыз қорғалған бет | ✅ 401 қайтарады |

---

## 12. Қорытынды

**SheberTab** жергілікті маман табу платформасы Render.com сервисіне сәтті орналастырылды. Жоба толық жұмыс режимінде:

- **Frontend** `https://shebertab.onrender.com` адресінде Static Site ретінде CDN арқылы жұмыс істейді
- **Backend** `https://shebertab-backend.onrender.com` адресінде Node.js Web Service ретінде жұмыс істейді
- **PostgreSQL** базасы Render-де орналасқан, автоматты инициализацияланады
- **Socket.io** WebSocket нақты уақыт хабарландырулары жұмыс істейді
- Барлық **REST API** endpoint-тері JSON форматында дұрыс жауап береді
- **JWT + bcrypt** қауіпсіздік жүйесі іске асырылған
- **Рөлдік жүйе** (admin / worker / client) жұмыс істейді
- Деплой барысында **6 қате** анықталды және барлығы сәтті түзетілді

---

**Жоба сілтемесі:** https://shebertab.onrender.com  
**Backend API:** https://shebertab-backend.onrender.com  
**GitHub:** https://github.com/meizu9255-blip/shebertab
