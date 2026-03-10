# 🏰 Oficina de Turismo de Barcelona

Aplicación web moderna desarrollada con **React, TypeScript y Vite** para la gestión turística de Barcelona. La plataforma permite a los turistas consultar actividades y eventos, mientras que proporciona herramientas de gestión para trabajadores y administradores.

## Utiliza git
staged changes
git commit -m "..."
git push

## 🚀 Características Principales

### 🌍 Portal Público
- **Home:** Landing page con secciones dinámicas de "Actividades Populares" y "Próximos Eventos".
- **Actividades:** Catálogo completo con **barra de búsqueda por nombre y filtro por precio máximo**.
- **Eventos:** Agenda cultural y festiva.
- **Info Útil:** Ubicación, contacto y clima en tiempo real.

### 👤 Panel de Turista (Rol: Registered)
- **Gestión de Reservas:** Reservar actividades con validación de duplicados.
- **Mis Reservas:** Listado inteligente con filtros de estado (**Todas/Confirmadas/Canceladas**) y ordenamiento automático.
- **Acciones:** Cancelar reserva propia e Imprimir comprobante (simulado).

### 👷 Panel de Trabajador (Rol: Worker)
- **Gestión de Contenido:** CRUD completo de Actividades y Eventos con **filtros de búsqueda**.
- **Gestión de Reservas:** 
  - Visualización separada de reservas **Confirmadas** y **Canceladas**.
  - **Buscador global** por ID de usuario o nombre de actividad.
  - Capacidad de cancelar reservas de terceros.

### 🛡️ Panel de Administrador (Rol: Admin)
- **Gestión de Usuarios:** Listado con **buscador por nombre/email**, eliminación de cuentas y cambio de roles.
- **Control Total:** Acceso heredado a todas las herramientas de trabajador.
- **Buzón de Mensajes:** Lectura y gestión de contacto con **filtrado de contenido**.

## 🛠️ Tecnologías Utilizadas

- **Core:** React 18, TypeScript, Vite.
- **Estado Global:** Zustand (con persistencia).
- **Server State:** TanStack Query (React Query) v5.
- **Routing:** React Router v6.
- **Base de Datos:** Mock Database (Persistencia en `localStorage` simulando latencia de red).

## 📦 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 🔐 Credenciales de Prueba

La aplicación utiliza un sistema de autenticación simulado. Puedes usar las siguientes cuentas preconfiguradas (la contraseña puede ser cualquiera, ej: `1234`):

| Rol | Email | Permisos |
|-----|-------|----------|
| **Admin** | `admin@bcn.cat` | Control total, gestión de usuarios y roles. |
| **Worker** | `worker@bcn.cat` | CRUD de actividades/eventos, ver reservas. |
| **Turista** | `u@test.com` | Reservar, ver mis reservas. |

> **Nota:** También puedes registrar nuevos usuarios desde el formulario de registro.

## 📂 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (Weather, ProtectedRoute...)
├── hooks/           # Custom hooks (useRealTimeWeather)
├── pages/           # Vistas principales (Home, Activities, Dashboards...)
│   ├── admin/       # Panel de Administrador
│   ├── auth/        # Login, Registro, Recuperación
│   ├── registered/  # Panel de Turista
│   └── worker/      # Panel de Trabajador
├── services/        # Lógica de MockDB (Base de datos simulada)
├── store/           # Estado global con Zustand
└── types/           # Definiciones de TypeScript
```
