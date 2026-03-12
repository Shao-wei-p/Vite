Ejemplos para enseñar cómo utilizar Vite + React.
Ante de empezar, debe descargar npm.
Ejecutar siguiente comando en cada carpeta para lanzar proyecto.
1. npm install
2. npm run dev

Creamos un proyecto: Oficina de Turismo de Valencia (Vite + React)

1. Estructura de Navegación (Páginas Públicas)
Crea una barra de navegación (Navbar) y rutas para:

Home: Hero con imagen de Valencia y bienvenida.

Actividades: Galería de tarjetas (Cards) con botón "Reservar" (solo visible para logueados).

Eventos: Lista de eventos culturales (Fallas, Gran Fira, etc.).

About: Historia breve de la oficina.

Ubicación: Sección con un placeholder de Google Maps (Iframe o recuadro gris).

Contacto: Formulario funcional para Visitantes (captura datos con useState).

Login: Selector de rol simple para simular el inicio de sesión.

2. Sistema de Roles y Funcionalidades (RBAC)
Usa Context API para manejar un estado de usuario con 4 roles. Al loguearse, cada uno va a su Perfil/Dashboard con estas capacidades:

Usuario Registrado: * Ver sus actividades reservadas.

Botones para Cancelar reserva e Imprimir comprobante (simular con un alert o console.log).

Trabajador: * Gestión de Actividades y Eventos: CRUD completo (Añadir, Modificar, Eliminar).

Visualizar lista de usuarios que han reservado cada actividad.

Administrador: * Gestión de Usuarios: Listar, añadir, editar y eliminar usuarios del sistema.

Control total sobre Actividades y Eventos (igual que el trabajador).

Bandeja de Entrada: Leer los mensajes enviados desde el formulario de contacto.

Visitante: Solo acceso a páginas públicas y envío de mensajes.

3. Requisitos Técnicos y Estilo
React Router: Implementa ProtectedRoute para bloquear el acceso a perfiles ajenos.

Hooks: Uso intensivo de useState para formularios, useEffect para simular carga de datos y useContext para la sesión.

UI/UX: Usa Tailwind CSS. Diseño limpio con colores naranjas y azules (estilo Valencia).

Simplicidad: No uses bases de datos externas. Usa arrays de objetos locales (mockData) que se actualicen en el estado de React.
