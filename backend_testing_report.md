# Практикалық жұмысқа арналған тестілеу қорытындысы (Backend Unit Testing)

Бұл құжатта **Mocha, Chai және Supertest** құралдарын пайдаланып Backend (Express.js) жүйесін қалай тестілегеніміз және қандай код жазылғаны көрсетілген. Бұл мәліметтерді есепке (отчетқа) тікелей қолдана аласыз.

## 1. Құралдар және орнату
Тестілеу үшін келесі кітапханалар қолданылды:
- **Mocha:** Тесттерді орындау ортасы (Test Runner).
- **Chai:** Күтілетін нәтижелерді тексеру кітапханасы (Assertion Library). Ол `expect` функциясын ұсынады.
- **Supertest:** API маршруттарына (HTTP) виртуалды түрде сұраныстар жіберіп, олардың жауабын тексеруге арналған құрал.

**Орнату командасы:**
```bash
cd shebertab-backend
npm install --save-dev mocha chai supertest
```

## 2. package.json баптаулары
Тесттерді автоматты түрде `npm test` командасымен іске қосу үшін `shebertab-backend/package.json` файлына мынадай скрипт қосылды:
```json
"scripts": {
  "test": "mocha test/**/*.test.js --timeout 5000 --exit",
  "start": "node server.js"
}
```

## 3. Архитектуралық өзгерістер (`server.js`)
Тесттер сервермен дұрыс байланысуы үшін `server.js` файлына өзгеріс енгізілді. Тест іске қосылған кезде сервер порты (EADDRINUSE) қатесін бермеуі үшін `server` мен `app` экспортталды:
```javascript
// server.js файлының соңы:
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} адресінде іске қосылды`);
  });
}
module.exports = { app, server };
```

## 4. Жазылған тесттер коды (`test/api.test.js`)
Төменде `shebertab-backend/test/api.test.js` файлында жазылған 4 түрлі API тестінің толық коды көрсетілген.

```javascript
const request = require('supertest');
const { expect } = require('chai');
const { app } = require('../server');

describe('SheberTab API Тесттері (Mocha & Chai)', function() {
  
  // 1. Сервердің негізгі күйін тексеру
  it('GET / - сервердің дұрыс жұмыс істеп тұрғанын тексеру (200 OK)', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.text).to.include('SheberTab Backend жұмыс істеп тұр!');
        done();
      });
  });

  // 2. Қате маршрутты тексеру
  it('GET /api/unknown - қате маршрут үшін 404 қайтаруын тексеру', function(done) {
    request(app)
      .get('/api/unknown_route_123')
      .expect(404, done);
  });

  // 3. Қызметтерді алу (базамен байланыс)
  it('GET /api/services - қызметтер тізімін JSON форматында алу', function(done) {
    request(app)
      .get('/api/services')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // 4. Валидацияны тексеру (Auth)
  it('POST /api/auth/register - бос мәліметтер жібергенде қате (500) қайтару', function(done) {
    request(app)
      .post('/api/auth/register')
      .send({}) // Бос объект
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
```

Бұл кодтар арқылы біз API маршруттарымыздың логикасы дұрыс жұмыс істеп тұрғанына, сондай-ақ қате мәліметтер келгенде жүйенің құламай, дұрыс статус код қайтаратынына көз жеткіземіз.
