-- Tabla de Usuarios
CREATE TYPE user_role AS ENUM ('public', 'registered', 'worker', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Actividades
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Mensajes (Contacto)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reservas (Asistentes)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    activity_id UUID REFERENCES activities(id),
    event_id UUID REFERENCES events(id),
    status VARCHAR(20) DEFAULT 'confirmed',
    booking_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT activity_or_event_check CHECK (
        (activity_id IS NOT NULL AND event_id IS NULL) OR 
        (activity_id IS NULL AND event_id IS NOT NULL)
    )
);
