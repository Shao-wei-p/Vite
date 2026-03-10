import React from 'react'
// ReactDOM: Es el "pegamento" entre React (lógica virtual) y el DOM real del navegador (HTML).
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'; // Importación de estilos globales. Vite los inyecta automáticamente en el <head>.

// ReactDOM.createRoot: API de React 18 para habilitar concurrencia.
// document.getElementById('root')!: El signo de exclamación (!) es una aserción de TypeScript.
// Le dice al compilador: "Confía en mí, estoy seguro de que este elemento existe en el HTML, no será null".
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode: Herramienta de desarrollo.
  // Renderiza los componentes dos veces (en dev) para detectar efectos secundarios impuros y problemas de ciclo de vida.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
