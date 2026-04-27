# SheberTab — Render-ге деплой жасау нұсқаулығы

Бұл нұсқаулық арқылы сіз өз жобаңызды интернетке шығарып, кез келген телефоннан немесе компьютерден ашылатын ете аласыз.

---

## 1. GitHub-қа жүктеу
Барлық кодты GitHub-қа жаңа репозиторий ретінде жүктеңіз (егер әлі жүктелмесе). Бэкенд пен Фронтенд бөлек папкаларда немесе бірге болуы мүмкін.

---

## 2. Дерекқорды (PostgreSQL) баптау

1. **[Render.com](https://render.com/)** сайтына кіріп, тіркеліңіз.
2. **New +** батырмасын басып, **PostgreSQL** таңдаңыз.
3. **Name**: `shebertab-db`
4. **Database**: `shebertab`
5. **User**: `admin`
6. **Region**: `Frankfurt (EU Central)` немесе өзіңізге жақын аймақ.
7. **Create Database** басыңыз.
8. Дайын болған соң, **Internal Database URL**-ді көшіріп алыңыз.

---

## 3. Бэкендті (Backend) деплой жасау

1. Render-де **New +** → **Web Service** таңдаңыз.
2. Өз GitHub репозиторийіңізді қосыңыз.
3. **Name**: `shebertab-backend`
4. **Root Directory**: `shebertab-backend` (егер бэкенд жеке папкада болса).
5. **Runtime**: `Node`
6. **Build Command**: `npm install`
7. **Start Command**: `node server.js`
8. **Environment Variables** (Advanced) бөліміне мыналарды қосыңыз:
   - `DATABASE_URL`: (Жоғарыда көшірілген Internal DB URL)
   - `JWT_SECRET`: (Кез келген құпия сөз, мысалы `mysecret123`)
   - `PORT`: `5000`
   - `FRONTEND_URL`: (Бұл жерге кейінірек Фронтендтің URL-ін қоясыз)
9. **Create Web Service** басыңыз.
10. Деплой аяқталған соң, сізге берілген URL-ді көшіріп алыңыз (мысалы: `https://shebertab-backend.onrender.com`).

---

## 4. Фронтендті (Frontend) деплой жасау

1. Render-де **New +** → **Static Site** таңдаңыз.
2. Өз GitHub репозиторийіңізді қосыңыз.
3. **Name**: `shebertab-app`
4. **Root Directory**: `shebertab-react`
5. **Build Command**: `npm run build`
6. **Publish Directory**: `dist`
7. **Environment Variables** бөліміне қосыңыз:
   - `VITE_API_URL`: (Бэкендтің Render-дегі URL-і, мысалы `https://shebertab-backend.onrender.com`)
8. **Create Static Site** басыңыз.

---

## 5. Соңғы қадам (CORS шешу)

Фронтендтің URL-і дайын болған соң (мысалы: `https://shebertab-app.onrender.com`):
1. Бэкендтің **Environment Variables** бөліміне қайта кіріңіз.
2. `FRONTEND_URL` мәнін өзгертіңіз: `https://shebertab-app.onrender.com`
3. Бэкендті қайта іске қосыңыз (Redeploy).

---

## Неге бұл маңызды?
- **DATABASE_URL**: Реальді базаға қосылу үшін.
- **VITE_API_URL**: Фронтенд бэкендті интернеттен табуы үшін.
- **FRONTEND_URL**: Бэкенд тек сіздің фронтендтен ғана сұраныстарды қабылдауы үшін (Қауіпсіздік).

**Енді сіздің сайтыңыз бүкіл әлемге қолжетімді!** 🚀
