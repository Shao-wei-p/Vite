import React from 'react';
import { Activity } from '../types';
import './Card.css'; // Importamos su propio CSS

// Definimos las props que espera este componente
interface CardProps {
  item: Activity;
  onAction: (id: number) => void; 
  actionLabel: string;
}

export const Card: React.FC<CardProps> = ({ item, onAction, actionLabel }) => {
  return (
    <article className="card">
      <img src={item.image} alt={item.title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.description}</p>
        <div className="card-footer">
          <span className="card-price">{item.price}€</span>
          <button 
            className="card-btn" 
            onClick={() => onAction(item.id)}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};
