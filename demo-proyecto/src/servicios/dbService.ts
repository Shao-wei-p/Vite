// IMPORTANTE: Importamos las interfaces en lugar de redefinirlas
import type { Tenant, User, Url, Project, Report, ActivityLog } from '../types/tiposDatos';

/**
 * dbService.ts
 * Servicio que simula la Base de Datos PostgreSQL definida en schema.sql.
 * Utiliza localStorage para persistencia en el navegador (entorno Demo).
 */

// ── Utilidades ─────────────────────────────────────────────────────────────

// IMPORTANTE: Cambio nombre de la key para forzar reseteo de datos en tu navegador
const STORAGE_KEY = 'demo_db_v2'; 
const DELAY_MS = 600; 

// Generador de UUID robusto (funciona en todos los navegadores)
const uuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const now = () => new Date().toISOString();
const delay = () => new Promise(r => setTimeout(r, DELAY_MS));

// ── Estado Inicial (Seed Data) ─────────────────────────────────────────────

const INITIAL_DB = {
  Tenant: [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Demo Organization', createdAt: now() },
    { id: '11111111-1111-1111-1111-111111111112', name: 'Acme Solutions S.L.', createdAt: now() },
    { id: '11111111-1111-1111-1111-111111111113', name: 'Ayuntamiento Digital', createdAt: now() },
    { id: '11111111-1111-1111-1111-111111111114', name: 'StartUp Innovadora', createdAt: now() }
  ] as Tenant[],
  Users: [
    { id: '22222222-2222-2222-2222-222222222221', email: 'admin@demo.com',  password: '123', role: 'admin', isSuperAdmin: true,  tenantId: '11111111-1111-1111-1111-111111111111', createdAt: now() },
    { id: '22222222-2222-2222-2222-222222222222', email: 'editor@acme.com', password: '123', role: 'editor', isSuperAdmin: false, tenantId: '11111111-1111-1111-1111-111111111112', createdAt: now() },
    { id: '22222222-2222-2222-2222-222222222223', email: 'tecnico@ayto.es', password: '123', role: 'admin',  isSuperAdmin: false, tenantId: '11111111-1111-1111-1111-111111111113', createdAt: now() },
    { id: '22222222-2222-2222-2222-222222222224', email: 'ceo@startup.io',  password: '123', role: 'viewer', isSuperAdmin: false, tenantId: '11111111-1111-1111-1111-111111111114', createdAt: now() }
  ] as User[],
  Url: [
    { id: '33333333-3333-3333-3333-333333333331', tenantId: '11111111-1111-1111-1111-111111111111', url: 'https://example.com', createdAt: now() },
    { id: '33333333-3333-3333-3333-333333333332', tenantId: '11111111-1111-1111-1111-111111111112', url: 'https://acme-shop.com', createdAt: now() },
    { id: '33333333-3333-3333-3333-333333333333', tenantId: '11111111-1111-1111-1111-111111111113', url: 'https://transparencia.ayto.es', createdAt: now() },
    { id: '33333333-3333-3333-3333-333333333334', tenantId: '11111111-1111-1111-1111-111111111114', url: 'https://app.startup.io', createdAt: now() }
  ] as Url[],
  Projects: [
    { id: '44444444-4444-4444-4444-444444444441', name: 'Web Corporativa',         tenantId: '11111111-1111-1111-1111-111111111111', urlId: '33333333-3333-3333-3333-333333333331', createdAt: now() },
    { id: '44444444-4444-4444-4444-444444444442', name: 'E-commerce Principal',    tenantId: '11111111-1111-1111-1111-111111111112', urlId: '33333333-3333-3333-3333-333333333332', createdAt: now() },
    { id: '44444444-4444-4444-4444-444444444443', name: 'Portal de Transparencia', tenantId: '11111111-1111-1111-1111-111111111113', urlId: '33333333-3333-3333-3333-333333333333', createdAt: now() },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Dashboard SaaS',          tenantId: '11111111-1111-1111-1111-111111111114', urlId: '33333333-3333-3333-3333-333333333334', createdAt: now() }
  ] as Project[],
  Report: [
    { id: '55555555-5555-5555-5555-555555555551', projectId: '44444444-4444-4444-4444-444444444441', status: 'completed', data: { score: 95, issues: [] }, createdAt: now() },
    { id: '55555555-5555-5555-5555-555555555552', projectId: '44444444-4444-4444-4444-444444444442', status: 'completed', data: { score: 68, issues: ['contrast', 'alt-text'] }, createdAt: now() },
    { id: '55555555-5555-5555-5555-555555555553', projectId: '44444444-4444-4444-4444-444444444443', status: 'failed',    data: null, createdAt: now() },
    { id: '55555555-5555-5555-5555-555555555554', projectId: '44444444-4444-4444-4444-444444444444', status: 'pending',   data: null, createdAt: now() }
  ] as Report[],
  ActivityLogs: [
    { id: '66666666-6666-6666-6666-666666666661', tenantId: '11111111-1111-1111-1111-111111111111', userId: '22222222-2222-2222-2222-222222222221', action: 'LOGIN_SUCCESS', metadata: { ip: "192.168.1.1" }, createdAt: now() },
    { id: '66666666-6666-6666-6666-666666666662', tenantId: '11111111-1111-1111-1111-111111111112', userId: '22222222-2222-2222-2222-222222222222', action: 'CREATE_PROJECT', metadata: { projectName: "E-commerce Principal" }, createdAt: now() },
    { id: '66666666-6666-6666-6666-666666666663', tenantId: '11111111-1111-1111-1111-111111111113', userId: '22222222-2222-2222-2222-222222222223', action: 'GENERATE_REPORT', metadata: { reportId: "55555555-5555-5555-5555-555555555553" }, createdAt: now() },
    { id: '66666666-6666-6666-6666-666666666664', tenantId: '11111111-1111-1111-1111-111111111114', userId: '22222222-2222-2222-2222-222222222224', action: 'UPDATE_SETTINGS', metadata: { theme: "dark" }, createdAt: now() }
  ] as ActivityLog[],
};

// ── Servicio Base de Datos ─────────────────────────────────────────────────

class MockDatabase {
  private db: typeof INITIAL_DB;

  constructor() {
    console.log('[DB] Iniciando servicio de base de datos mock...');
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          console.log('[DB] Datos encontrados en LocalStorage. Cargando...');
          this.db = JSON.parse(stored);
        } else {
          console.log('[DB] LocalStorage vacío o versión nueva. Sembrando datos iniciales...');
          // Deep copy para evitar referencias compartidas
          this.db = JSON.parse(JSON.stringify(INITIAL_DB));
          this.save();
        }
    } catch (e) {
        console.error('[DB] Error al inicializar DB:', e);
        this.db = JSON.parse(JSON.stringify(INITIAL_DB));
    }
  }

  private save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (e) {
        console.error('[DB] Error guardando en LocalStorage (posible cuota excedida)', e);
    }
  }

  // ── TENANTS ──────────────────────────────────────────────────────────────
  async getTenants(): Promise<Tenant[]> {
    await delay();
    return this.db.Tenant;
  }

  async createTenant(name: string): Promise<Tenant> {
    await delay();
    const newTenant: Tenant = { id: uuid(), name, createdAt: now() };
    this.db.Tenant.push(newTenant);
    this.save();
    return newTenant;
  }

  // ── PROJECTS (Incluye lógica de Url relational) ──────────────────────────
  async getProjects(tenantId?: string): Promise<(Project & { url: string })[]> {
    await delay();
    const projects = tenantId 
      ? this.db.Projects.filter(p => p.tenantId === tenantId)
      : this.db.Projects;

    // Join implícito con tabla Url para devolver la URL string
    return projects.map(p => {
      const urlRecord = this.db.Url.find(u => u.id === p.urlId);
      return { ...p, url: urlRecord ? urlRecord.url : '' };
    });
  }

  async createProject(data: { name: string; url: string; tenantId: string; userId: string }): Promise<Project> {
    await delay();
    
    // 1. Crear registro en Url
    const newUrl: Url = {
      id: uuid(),
      tenantId: data.tenantId,
      url: data.url,
      createdAt: now()
    };
    this.db.Url.push(newUrl);

    // 2. Crear registro en Projects
    const newProject: Project = {
      id: uuid(),
      name: data.name,
      tenantId: data.tenantId,
      urlId: newUrl.id,
      createdAt: now()
    };
    this.db.Projects.push(newProject);

    // 3. Log Activity (Simulación de trigger)
    this.logActivitySync({
      tenantId: data.tenantId,
      userId: data.userId,
      action: 'CREATE_PROJECT',
      metadata: { projectName: data.name }
    });

    this.save();
    return newProject;
  }

  async deleteProject(id: string): Promise<void> {
    await delay();
    this.db.Projects = this.db.Projects.filter(p => p.id !== id);
    // Nota: Deberíamos borrar en cascada Reports y Urls si queremos integridad estricta
    this.save();
  }

  // ── REPORTS ──────────────────────────────────────────────────────────────
  async getReportsByProject(projectId: string): Promise<Report[]> {
    await delay();
    return this.db.Report.filter(r => r.projectId === projectId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createReport(projectId: string, data: Record<string, unknown>): Promise<Report> {
    await delay();
    const newReport: Report = {
      id: uuid(),
      projectId,
      status: 'completed',
      data,
      createdAt: now()
    };
    this.db.Report.push(newReport);
    this.save();
    return newReport;
  }

  // ── USERS & AUTH ─────────────────────────────────────────────────────────
  
  async login(email: string, passwordInput: string): Promise<User | null> {
    await delay(); // Simular latencia de red/procesamiento
    console.log(`[DB] Intento de login: ${email}`);

    // Busca el usuario ignorando mayúsculas/minúsculas
    const user = this.db.Users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Comprobar si existe y si la contraseña es correcta
    if (!user) {
        console.warn('[DB] Usuario no encontrado');
        return null;
    }

    if (user.password !== passwordInput) {
        console.warn('[DB] Contraseña incorrecta');
        return null;
    }
    
    console.log('[DB] Login exitoso');
    // CORRECCIÓN: Usar desestructuración correcta para eliminar 'password' del objeto retornado
    // 'password: _' asigna la propiedad password a una variable '_' (que ignoramos)
    // '...safeUser' recoge el resto de propiedades.
    const { password, ...safeUser } = user;
    return safeUser as User;
  }

  async registerUser(email: string, passwordInput: string, role: string = 'registered'): Promise<User> {
    await delay();
    
    // Validación de negocio: no duplicar emails
    if (this.db.Users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("El email ya existe");
    }

    // Creamos el nuevo usuario
    const newUser: User = {
        id: uuid(),
        email,
        password: passwordInput,
        role: role,
        isSuperAdmin: false,
        tenantId: null, // Se asignaría posteriormente a un Tenant
        createdAt: now()
    };

    this.db.Users.push(newUser);
    this.save();
    
    // CORRECCIÓN: Devolver sin contraseña
    const { password, ...safeUser } = newUser;
    return safeUser as User;
  }

  async getUsers(): Promise<User[]> {
    await delay();
    // Devolver lista de usuarios sanitizada (sin contraseñas)
    return this.db.Users.map(u => {
        // CORRECCIÓN: Eliminar contraseña de cada usuario
        const { password, ...safeUser } = u;
        return safeUser as User;
    });
  }

  async deleteUser(id: string): Promise<void> {
    await delay();
    this.db.Users = this.db.Users.filter(u => u.id !== id);
    this.save();
  }

  async updateUserRole(id: string, role: string): Promise<void> {
    await delay();
    const user = this.db.Users.find(u => u.id === id);
    if (user) {
        user.role = role;
        this.save();
    }
  }

  // ── LOGS (Interno) ───────────────────────────────────────────────────────
  private logActivitySync(log: Omit<ActivityLog, 'id' | 'createdAt'>) {
    const newLog: ActivityLog = {
      id: uuid(),
      createdAt: now(),
      ...log
    };
    this.db.ActivityLogs.push(newLog);
  }
}

// Exportar una única instancia (Singleton pattern)
export const dbService = new MockDatabase();
