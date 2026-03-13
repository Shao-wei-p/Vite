-- Habilitar extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE userRole = 'superAdmin' | 'admin' | 'editor' | 'viewer';

-- ── Table: Tenant ────────────────────────────────────────────────────────────
CREATE TABLE Tenant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- ── Table: Users ─────────────────────────────────────────────────────────────
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role userRole,
    isSuperAdmin BOOLEAN DEFAULT FALSE,
    tenantId UUID REFERENCES Tenant(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- ── Table: Url ───────────────────────────────────────────────────────────────
CREATE TABLE Url (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenantId UUID REFERENCES Tenant(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- ── Table: Projects ──────────────────────────────────────────────────────────
CREATE TABLE Projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tenantId UUID REFERENCES Tenant(id) ON DELETE CASCADE,
    urlId UUID REFERENCES Url(id) ON DELETE SET NULL,
    -- createdBy UUID REFERENCES Users(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- ── Table: Report ────────────────────────────────────────────────────────────
CREATE TABLE Report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projectId UUID REFERENCES Projects(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    data JSONB,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- ── Table: ActivityLogs ──────────────────────────────────────────────────────
CREATE TABLE ActivityLogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenantId UUID REFERENCES Tenant(id) ON DELETE CASCADE,
    userId UUID REFERENCES Users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    metadata JSONB,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- --- SEED DATA (Datos Iniciales) ---------------------------------------------

-- 1. Tenant (4 ejemplos)
INSERT INTO Tenant (id, name, createdAt) VALUES 
('11111111-1111-1111-1111-111111111111', 'Demo Organization', NOW()),
('11111111-1111-1111-1111-111111111112', 'Acme Solutions S.L.', NOW()),
('11111111-1111-1111-1111-111111111113', 'Ayuntamiento Digital', NOW()),
('11111111-1111-1111-1111-111111111114', 'StartUp Innovadora', NOW());

-- 2. Users (4 ejemplos asociados a los tenants)
INSERT INTO Users (id, email, password, role, isSuperAdmin, tenantId, createdAt) VALUES 
('22222222-2222-2222-2222-222222222221', 'admin@demo.com', '123', 'superAdmin', TRUE, '11111111-1111-1111-1111-111111111111', NOW()),
('22222222-2222-2222-2222-222222222222', 'editor@acme.com', '123', 'editor', FALSE, '11111111-1111-1111-1111-111111111112', NOW()),
('22222222-2222-2222-2222-222222222223', 'tecnico@ayto.es', '123', 'admin', FALSE, '11111111-1111-1111-1111-111111111113', NOW()),
('22222222-2222-2222-2222-222222222224', 'ceo@startup.io', '123', 'viewer', FALSE, '11111111-1111-1111-1111-111111111114', NOW());

-- 3. Url (4 ejemplos asociados a los tenants)
INSERT INTO Url (id, tenantId, url, createdAt) VALUES 
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'https://example.com', NOW()),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111112', 'https://acme-shop.com', NOW()),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111113', 'https://transparencia.ayto.es', NOW()),
('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111114', 'https://app.startup.io', NOW());

-- 4. Projects (4 ejemplos vinculando Tenant y Url)
INSERT INTO Projects (id, name, tenantId, urlId, createdAt) VALUES 
('44444444-4444-4444-4444-444444444441', 'Web Corporativa', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', NOW()),
('44444444-4444-4444-4444-444444444442', 'E-commerce Principal', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333332', NOW()),
('44444444-4444-4444-4444-444444444443', 'Portal de Transparencia', '11111111-1111-1111-1111-111111111113', '33333333-3333-3333-3333-333333333333', NOW()),
('44444444-4444-4444-4444-444444444444', 'Dashboard SaaS', '11111111-1111-1111-1111-111111111114', '33333333-3333-3333-3333-333333333334', NOW());

-- 5. Report (4 ejemplos asociados a proyectos)
INSERT INTO Report (id, projectId, status, data, createdAt) VALUES 
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'completed', '{"score": 95, "issues": []}', NOW()),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', 'completed', '{"score": 68, "issues": ["contrast", "alt-text"]}', NOW()),
('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', 'failed', NULL, NOW()),
('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444444', 'pending', NULL, NOW());

-- 6. ActivityLogs (4 ejemplos de auditoría)
INSERT INTO ActivityLogs (id, tenantId, userId, action, metadata, createdAt) VALUES 
('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'LOGIN_SUCCESS', '{"ip": "192.168.1.1"}', NOW()),
('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'CREATE_PROJECT', '{"projectName": "E-commerce Principal"}', NOW()),
('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222223', 'GENERATE_REPORT', '{"reportId": "55555555-5555-5555-5555-555555555553"}', NOW()),
('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222224', 'UPDATE_SETTINGS', '{"theme": "dark"}', NOW());
