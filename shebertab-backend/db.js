const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Дерекқорға (PostgreSQL) қосылу қателігі:', err.stack);
  } else {
    console.log('PostgreSQL дерекқорына сәтті қосылды');
    try {
      const res = await client.query('SELECT count(*) FROM services');
      if (res.rows[0].count === '0') {
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
      // Clean up any duplicates in the workers table (just in case they were created during testing)
      await client.query(`
        DELETE FROM workers 
        WHERE id NOT IN (
          SELECT MIN(id) FROM workers GROUP BY user_id
        )
      `);

      // Add is_rated column to orders table if it doesn't exist
      await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_rated BOOLEAN DEFAULT false;`);

      // Create notifications table
      await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Add notification_type and sender_id columns if not exist
      await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50) DEFAULT 'general';`);
      await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);

      // Create messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          message_text TEXT NOT NULL,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed mock workers for testing orders
      const workersRes = await client.query('SELECT count(*) FROM workers');
      if (parseInt(workersRes.rows[0].count) < 7) {
        // Insert all 6 mock users
        await client.query(`
          INSERT INTO users (full_name, email, password_hash, role) VALUES 
          ('Асқар Жақсылықов', 'askar@test.kz', 'mock', 'worker'),
          ('Дәурен Сейітов', 'dauren@test.kz', 'mock', 'worker'),
          ('Нұрлан Бекенов', 'nurlan@test.kz', 'mock', 'worker'),
          ('Айгүл Мұсаева', 'aigul@test.kz', 'mock', 'worker'),
          ('Ермек Тоқтаров', 'ermek@test.kz', 'mock', 'worker'),
          ('Самал Ахметова', 'samal@test.kz', 'mock', 'worker')
          ON CONFLICT (email) DO NOTHING;
        `);
        // Get their IDs
        const uRes = await client.query("SELECT id, email FROM users WHERE email IN ('askar@test.kz', 'dauren@test.kz', 'nurlan@test.kz', 'aigul@test.kz', 'ermek@test.kz', 'samal@test.kz')");
        const users = uRes.rows;
        
        // Insert mock workers
        for (const u of users) {
          let serviceId = 4; // Default Құрылыс
          let price = '5000 ₸';
          
          if (u.email === 'askar@test.kz') { serviceId = 3; price = '5000 ₸'; } // Сантехник
          else if (u.email === 'dauren@test.kz') { serviceId = 2; price = '4500 ₸'; } // Электрик
          else if (u.email === 'nurlan@test.kz') { serviceId = 4; price = '8000 ₸'; }
          else if (u.email === 'aigul@test.kz') { serviceId = 1; price = '3000 ₸'; } // Тазалық
          else if (u.email === 'ermek@test.kz') { serviceId = 4; price = '6000 ₸'; }
          else if (u.email === 'samal@test.kz') { serviceId = 1; price = '2500 ₸'; }

          await client.query(`
            INSERT INTO workers (user_id, service_id, price_range, average_time) 
            SELECT $1, $2, $3, '2 сағат'
            WHERE NOT EXISTS (SELECT 1 FROM workers WHERE user_id = $1)
          `, [u.id, serviceId, price]);
        }
        console.log('Базаға барлық 6 тесттік мамандар (workers) сәтті қосылды немесе тексерілді!');
      }

      // Seed an Admin user if none exists
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
      console.error('Қызметтерді қосу кезінде қате орын алды:', e);
    }
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
