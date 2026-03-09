# 📚 Documentación Técnica y Stack Tecnológico

Este documento detalla las tecnologías principales utilizadas en el proyecto **Oficina de Turismo de Barcelona**, explicando su propósito general y su implementación específica en esta aplicación.

## ⚡ Vite
**¿Qué es?**
Un entorno de desarrollo frontend de nueva generación. Es significativamente más rápido que herramientas anteriores (como Webpack) gracias a que sirve el código fuente sobre ESM (ECMAScript Modules) nativo.

**¿Cómo funciona en el proyecto?**
*   **Scaffolding (Andamiaje):** Se refiere a la generación automática de la estructura base del proyecto. Al ejecutar `npm create vite@latest`, Vite crea toda la jerarquía de carpetas necesaria (`src`, `public`, `assets`), configura el `package.json`, `tsconfig.json` y los puntos de entrada (`index.html`, `main.tsx`) para que podamos empezar a programar la lógica de negocio inmediatamente sin perder tiempo en configuraciones iniciales.
*   **Hot Module Replacement (HMR):** Permite que, al guardar un cambio en un archivo `.tsx` o `.css`, el navegador se actualice casi instantáneamente sin perder el estado de la aplicación.
*   **Build:** Gestiona la compilación final (comando `npm run build`), optimizando y minificando el código para producción.

## 📘 TypeScript
**¿Qué es?**
Un superset de JavaScript que añade tipado estático opcional. Permite detectar errores en tiempo de compilación en lugar de en tiempo de ejecución.

**¿Cómo funciona en el proyecto?**
*   **Interfaces Centralizadas:** En `src/types/index.ts` hemos definido los "contratos" de nuestros datos (`User`, `Activity`, `Event`, `Role`).
*   **Seguridad:** Evita errores comunes, como intentar acceder a una propiedad que no existe en un objeto. Por ejemplo, si intentamos acceder a `user.password` en un componente donde no debe estar disponible, TypeScript nos alertará.
*   **Intellisense:** Facilita el desarrollo al autocompletar las propiedades disponibles en los componentes y hooks.

## ⚛️ React
**¿Qué es?**
Una biblioteca de JavaScript para construir interfaces de usuario basada en componentes.

**¿Cómo funciona en el proyecto?**
*   **Arquitectura:** Hemos separado la UI en `pages` (vistas completas como `Home`, `Activities`) y `components` reutilizables (`WeatherAside`, `ProtectedRoute`).
*   **Hooks:** Utilizamos Hooks nativos como `useState` para estados locales efímeros (ej. textos en barras de búsqueda) y `useEffect` (aunque minimizado gracias a React Query).

## 🐻 Zustand
**¿Qué es?**
Una solución de gestión de estado global pequeña, rápida y escalable. Es una alternativa más simple a Redux.

**¿Cómo funciona en el proyecto?**
Lo utilizamos específicamente para el **Estado del Cliente (Client State)**, que es síncrono y global.

1.  **Archivo:** `src/store/authStore.ts`.
2.  **Autenticación:** Almacena si el usuario está logueado (`isAuthenticated`) y sus datos básicos (`user`).
3.  **Persistencia:** Utilizamos el middleware `persist` de Zustand. Esto guarda automáticamente el estado en `localStorage`. Si refrescas la página, la sesión se mantiene activa sin necesidad de código extra en los componentes.

```typescript
// Ejemplo de uso
const login = useAuthStore(s => s.login); // Accede a la acción
const user = useAuthStore(s => s.user);   // Accede al dato
```

## 🔴 TanStack Query (React Query)
**¿Qué es?**
Una biblioteca para la gestión del **Estado del Servidor (Server State)**. Maneja la obtención de datos (fetching), el almacenamiento en caché (caching), la sincronización y la actualización del estado.

**¿Cómo funciona en el proyecto?**
Es el motor principal de datos de la aplicación. Reemplaza la necesidad de usar `useEffect` para llamar a APIs.

1.  **Fetching (useQuery):**
    *   Se usa para leer datos (`getActivities`, `getEvents`).
    *   **Caching Automático:** Si un usuario va de "Actividades" a "Home" y vuelve, los datos se cargan instantáneamente desde la caché, mejorando la experiencia de usuario (UX).
    *   **Simulación de Latencia:** Como usamos `MockDB`, React Query gestiona los estados de `isLoading` mientras el `setTimeout` de la base de datos simulada termina.

2.  **Mutations (useMutation):**
    *   Se usa para modificar datos (`createBooking`, `deleteUser`, `saveActivity`).
    *   **Invalidación de Queries:** Esta es la parte clave. Cuando creamos una reserva (`mutation`), le decimos a React Query que invalide la clave `['myBookings']`. Esto fuerza a la aplicación a volver a pedir los datos automáticamente, actualizando la lista de reservas sin recargar la página.

3.  **Integración con MockDB:**
    Actúa como intermediario entre los componentes de React y nuestra `MockDB`, tratando las llamadas a `localStorage` como si fueran peticiones HTTP asíncronas reales.

```typescript
// Flujo típico en el proyecto:
// 1. Componente pide datos
const { data, isLoading } = useQuery({ queryKey: ['activities'], queryFn: ... });

// 2. Usuario modifica datos
const mutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] }) 
    // ^ Esto provoca que el paso 1 se ejecute de nuevo automáticamente
});
```

## ⚖️ Decisión de Arquitectura: Mapa de Datos

Para responder a **"¿Qué va en Zustand y qué va en TanStack Query?"** en este proyecto específico, seguimos esta regla:

> **Regla de Oro:** Si los datos son compartidos por múltiples usuarios ("persisten en el servidor") usa **TanStack Query**. Si los datos son temporales o específicos de la sesión actual de navegador ("estado de UI"), usa **Zustand**.

### 1. Datos Externos (Manejados por TanStack Query)
Estos datos se consideran "remotos". Aunque aquí simulamos el servidor con `MockDB`, la aplicación los trata como si vinieran de una API asíncrona con latencia (`setTimeout`).

*   **Actividades y Eventos:** Catálogo público. Si un admin cambia un precio, todos deben verlo actualizado.
*   **Reservas (Bookings):** Base de datos de transacciones. Necesita sincronización para evitar que dos personas reserven el último cupo.
*   **Lista de Usuarios (Admin):** Información que reside en la base de datos del sistema.
*   **Clima (Weather):** Datos externos que cambian independientemente de nuestra app (vienen de una "API").
*   **Mensajes de Contacto:** Datos que se guardan en el servidor para ser leídos después.

### 2. Datos del Navegador (Manejados por Zustand)
Estos datos pertenecen al **cliente**. No necesitan sincronizarse con el servidor constantemente, sino que definen cómo se comporta la aplicación para el usuario actual.

*   **Sesión de Usuario (`user`, `isAuthenticated`):** 
    *   *¿Por qué?* Saber "quién soy yo" es un estado global de la sesión. No hacemos una petición a la API cada vez que un componente necesita saber si muestra el botón de "Login" o "Logout". Lo guardamos en memoria (y persistimos en local) para acceso instantáneo y síncrono.
*   **(Potencialmente) Tema UI / Preferencias:** Si tuviéramos un botón de "Modo Oscuro" o "Idioma", iría aquí, ya que es una preferencia del navegador actual.
