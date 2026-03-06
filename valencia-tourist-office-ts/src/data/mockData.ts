import { User, Activity } from '../types';

export const USERS: User[] = [
  { id: 1, username: 'JuanVisitante', role: 'visitor' },
  { id: 2, username: 'AnaUser', role: 'registered' },
  { id: 3, username: 'CarlosWorker', role: 'worker' },
  { id: 4, username: 'AdminJefe', role: 'admin' },
];

export const ACTIVITIES: Activity[] = [
  { 
    id: 101, 
    title: 'Visita a la Ciudad de las Artes', 
    description: 'Recorrido completo por el complejo arquitectónico.', 
    price: 35,
    image: 'https://via.placeholder.com/300x200?text=Arts'
  },
  { 
    id: 102, 
    title: 'Tour de Tapas en el Carmen', 
    description: 'Gastronomía local por el barrio antiguo.', 
    price: 25,
    image: 'https://via.placeholder.com/300x200?text=Tapas'
  }
];
