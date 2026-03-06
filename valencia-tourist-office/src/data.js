export const INITIAL_DATA = {
  activities: [
    { id: 1, title: "Ruta de la Paella", desc: "Clase de cocina en la Albufera paso a paso.", price: 45, image: "🥘" },
    { id: 2, title: "Visita Ciudad Artes", desc: "Tour guiado arquitectónico futurista.", price: 30, image: "🏛️" },
    { id: 3, title: "Paseo en Barco", desc: "Atardecer en la costa valenciana.", price: 25, image: "⛵" },
  ],
  events: [
    { id: 1, title: "La Tomatina 2024", date: "2024-08-28", location: "Buñol", status: "Programado" },
    { id: 2, title: "Fallas - La Crida", date: "2024-02-25", location: "Torres de Serranos", status: "Finalizado" },
  ],
  reservations: [
    { userId: 2, activityId: 1, date: "2024-03-20" } // Ejemplo: Usuario Registrado ha reservado Paella
  ],
  users: [
    { id: 1, username: "visitor", role: "visitor" }, 
    { id: 2, username: "registered", role: "registered" }, 
    { id: 3, username: "worker", role: "worker" },   
    { id: 4, username: "admin", role: "admin" },     
  ],
  messages: []
};
