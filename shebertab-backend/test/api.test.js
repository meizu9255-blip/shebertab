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
