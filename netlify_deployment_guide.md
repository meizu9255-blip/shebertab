# SheberTab Frontend-ті Netlify-ға шығару нұсқаулығы

Жобаңызды (React frontend) телефоннан ашып көру үшін оны **Netlify** платформасына тегін орналастырамыз.

## 1-қадам: GitHub-қа жүктеу
Алдымен барлық жаңа кодтарды GitHub-қа сақтап, жіберу керек:
Терминалды ашып, басты папкада (`Shebertab`) мыналарды жазыңыз:
```powershell
git add .
git commit -m "chore: added Netlify redirects and ready for deploy"
git push
```

## 2-қадам: Netlify-ға кіру
1. Браузерден [https://app.netlify.com/](https://app.netlify.com/) сайтына кіріп, **GitHub арқылы (Sign in with GitHub)** логин жасаңыз.
2. Басты бетте **"Add new site"** -> **"Import an existing project"** батырмасын басыңыз.
3. **GitHub** таңдап, өзіңіздің `shebertab-react` немесе басты `Shebertab` репозиторийіңізді тауып, басыңыз.

## 3-қадам: Баптаулар (Deploy Settings)
Егер сіздің бүкіл жобаңыз бір репозиторийде болса (яғни ішінде backend және react папкалары бар болса), мына баптауларды дәл осылай қойыңыз:

- **Base directory:** `shebertab-react` *(өте маңызды, себебі frontend осы папканың ішінде)*
- **Build command:** `npm run build`
- **Publish directory:** `shebertab-react/dist`

### Environment variables (Орта айнымалылары)
Кішкене төмен түсіп, **"Add environment variables"** (немесе Advanced build settings) түймесін басыңыз да, мынаны қосыңыз:
- **Key:** `VITE_API_URL`
- **Value:** `https://shebertab-backend.onrender.com` *(Render-дегі backend сілтемеңіз. Егер сілтеме басқаша болса, соны қойыңыз).*

## 4-қадам: Іске қосу
Барлығын толтырған соң, **"Deploy site"** түймесін басыңыз. 
Шамамен 1-2 минуттан соң Netlify сізге жасыл түспен дайын сілтемені (мәселен, `https://shebertab-xxx.netlify.app`) береді. 

Сол сілтемені телефонға жіберіп, кез келген жерден ашып көре аласыз!

*(Ескерту: React Router дұрыс жұмыс істеуі үшін мен автоматты түрде `public/_redirects` файлын қосып қойдым, сондықтан беттер арасында өту кезінде ешқандай қате болмайды).*
