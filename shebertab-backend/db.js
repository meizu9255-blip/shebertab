const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Дерекқорға (PostgreSQL) қосылу қателігі:', err.stack);
    return;
  }

  console.log('PostgreSQL дерекқорына сәтті қосылды');

  try {
    // ─── 1. КЕСТЕЛЕРДІ ЖАСАУ (schema) ───
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT,
        role VARCHAR(50) DEFAULT 'client',
        phone VARCHAR(50),
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        rating NUMERIC(3, 2) DEFAULT 0.0,
        price_range VARCHAR(50),
        average_time VARCHAR(50)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        is_rated BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        notification_type VARCHAR(50) DEFAULT 'general',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Миграция: is_rated бағанасы жоқ болса қосу
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_rated BOOLEAN DEFAULT false;`);
    // Миграция: notifications-ке notification_type және sender_id қосу
    await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50) DEFAULT 'general';`);
    await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);

    console.log('Барлық кестелер тексерілді / жасалды');

    // ─── 2. SEED: Services ───
    const servicesRes = await client.query('SELECT count(*) FROM services');
    if (servicesRes.rows[0].count === '0') {
      await client.query(`
        INSERT INTO services (id, title, description) VALUES
        (1, 'Үй тазалау', 'Үй мен пәтерлерді кәсіби тазалау'),
        (2, 'Электрик', 'Розетка, сымдарды жөндеу және орнату'),
        (3, 'Сантехник', 'Құбырларды, раковиналарды жөндеу'),
        (4, 'Құрылыс / Жөндеу', 'Үй ішіндегі кішігірім құрылыс жұмыстары')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('Базаға қызмет түрлері (services) сәтті қосылды!');
    }

    // ─── 3. SEED: Workers ───
    const workersCountRes = await client.query('SELECT count(*) FROM workers');
    if (parseInt(workersCountRes.rows[0].count) < 6) {
      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role) VALUES
        ('Асқар Жақсылықов', 'askar@test.kz', 'mock', 'worker'),
        ('Дәурен Сейітов',   'dauren@test.kz', 'mock', 'worker'),
        ('Нұрлан Бекенов',   'nurlan@test.kz', 'mock', 'worker'),
        ('Айгүл Мұсаева',    'aigul@test.kz',  'mock', 'worker'),
        ('Ермек Тоқтаров',   'ermek@test.kz',  'mock', 'worker'),
        ('Самал Ахметова',   'samal@test.kz',  'mock', 'worker')
        ON CONFLICT (email) DO NOTHING;
      `);

      const uRes = await client.query(
        "SELECT id, email FROM users WHERE email IN ('askar@test.kz','dauren@test.kz','nurlan@test.kz','aigul@test.kz','ermek@test.kz','samal@test.kz')"
      );

      for (const u of uRes.rows) {
        let serviceId = 4, price = '5000 ₸';
        if (u.email === 'askar@test.kz')  { serviceId = 3; price = '5000 ₸'; }
        if (u.email === 'dauren@test.kz') { serviceId = 2; price = '4500 ₸'; }
        if (u.email === 'nurlan@test.kz') { serviceId = 4; price = '8000 ₸'; }
        if (u.email === 'aigul@test.kz')  { serviceId = 1; price = '3000 ₸'; }
        if (u.email === 'ermek@test.kz')  { serviceId = 4; price = '6000 ₸'; }
        if (u.email === 'samal@test.kz')  { serviceId = 1; price = '2500 ₸'; }

        await client.query(`
          INSERT INTO workers (user_id, service_id, price_range, average_time)
          SELECT $1, $2, $3, '2 сағат'
          WHERE NOT EXISTS (SELECT 1 FROM workers WHERE user_id = $1)
        `, [u.id, serviceId, price]);
      }
      console.log('Тесттік мамандар (workers) сәтті қосылды!');
    }

    // ─── 4. SEED: Admin ───
    const adminRes = await client.query("SELECT * FROM users WHERE role = 'admin'");
    if (adminRes.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminHash = await bcrypt.hash('admin123', salt);
      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES ('Бас Әкімші', 'admin@shebertab.kz', $1, 'admin')
        ON CONFLICT (email) DO NOTHING
      `, [adminHash]);
      console.log('Админ аккаунты құрылды: admin@shebertab.kz / admin123');
    }

  } catch (e) {
    console.error('Дерекқорды инициализациялау кезінде қате:', e);
  } finally {
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
