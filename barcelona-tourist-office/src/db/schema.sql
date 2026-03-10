-- Limpieza inicial (opcional, para resetear)
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS events;
-- DROP TABLE IF EXISTS activities;
-- DROP TABLE IF EXISTS users;
-- DROP TYPE IF EXISTS user_role;

-- Tipos ENUM
CREATE TYPE user_role AS ENUM ('public', 'registered', 'worker', 'admin');

-- Tabla de Usuarios
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY, -- Usamos VARCHAR para aceptar 'u1' y UUIDs
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- En MockDB no se usa, pero en SQL es obligatorio
    role user_role DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Actividades
CREATE TABLE activities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL, -- Coincide con 'price' number
    image TEXT, -- Coincide con 'image' string (emoji o URL)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Eventos
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL, -- Cambiado de 'name' a 'title' para coincidir con MockDB
    date DATE NOT NULL,
    location VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Mensajes (Contacto)
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    date TIMESTAMP DEFAULT NOW() -- Coincide con 'date' de MessageDB
);

-- Tabla de Reservas
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    activity_id VARCHAR(50) REFERENCES activities(id) ON DELETE SET NULL,
    -- Datos snapshot para historial (como en MockDB)
    activity_title VARCHAR(150), 
    price DECIMAL(10, 2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'confirmed', -- 'confirmed' | 'cancelled'
    date DATE NOT NULL, -- Fecha de la reserva
    created_at TIMESTAMP DEFAULT NOW()
);

-- --- SEED DATA (Datos Iniciales idénticos a MockDB) ---

-- Usuarios (Password placeholder para todos: '1234')
INSERT INTO users (id, username, email, password_hash, role) VALUES
('u1', 'Admin', 'admin@bcn.cat', '$2b$10$PlaceholderHash...', 'admin'),
('u2', 'Worker', 'worker@bcn.cat', '$2b$10$PlaceholderHash...', 'worker'),
('u3', 'Turista', 'u@test.com', '$2b$10$PlaceholderHash...', 'registered');

-- Actividades
INSERT INTO activities (id, title, description, price, image) VALUES
('1', 'Sagrada Familia Tour', 'Visita guiada con acceso rápido.', 35.00, '🏰'),
('2', 'Park Güell', 'Paseo por el parque modernista.', 15.00, '🦎'),
('3', 'Ruta de Tapas', 'Degustación por el barrio gótico.', 45.00, '🍷'),
('4', 'Paseo en Barco', 'Vistas del skyline desde el mar.', 20.00, '⛵'),
('5', 'Museo Picasso', 'Colección permanente del artista.', 12.00, '🎨'),
('6', 'Camp Nou Experience', 'Tour por el estadio del Barça.', 30.00, '⚽');

-- Eventos
INSERT INTO events (id, title, date, location, description) VALUES
('1', 'Fiesta de la Mercè', '2024-09-24', 'Toda la ciudad', 'La fiesta mayor de Barcelona.'),
('2', 'Primavera Sound', '2024-06-01', 'Parc del Fòrum', 'Festival internacional de música.'),
('3', 'Sant Jordi', '2024-04-23', 'Las Ramblas', 'Día del libro y la rosa.');
