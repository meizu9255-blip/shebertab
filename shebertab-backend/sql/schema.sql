-- PostgreSQL үшін SheberTab кестелері (Практикалық жұмыс №3 нұсқаулығы бойынша)
-- Database: shebertab, pgAdmin-де орындаңыз.

-- 1. Users (Пайдаланушылар) кестесі
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT,
    role VARCHAR(50) DEFAULT 'client', -- 'client' немесе 'worker'
    phone VARCHAR(50),
    provider VARCHAR(50) DEFAULT 'local', 
    provider_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services (Қызмет түрлері) кестесі
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT
);

-- 3. Workers (Мамандар) кестесі
CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    rating NUMERIC(3, 2) DEFAULT 0.0,
    price_range VARCHAR(50),      -- қызмет бағасы
    average_time VARCHAR(50)      -- орташа жұмыс уақыты
);

-- 4. Orders (Тапсырыстар) кестесі
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, completed, rejected
    is_rated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Notifications (Хабарландырулар) кестесі — Практикалық жұмыс №5
-- notification_type: 'general' | 'order_new' | 'order_update' | 'rating_prompt' | 'chat'
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- хабарлама жіберуші (чат үшін)
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Messages (Чат хабарламалары) кестесі — Практикалық жұмыс №5
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

