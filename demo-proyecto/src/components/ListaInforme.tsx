import React, { useState } from 'react';
import { Report } from '../types/tiposDatos';
import './DataLists.css';

interface ListaInformeProps {
  reports: Report[];
  onNewReport: () => void;
  onDownload: (id: string) => void;
}

const ListaInforme: React.FC<ListaInformeProps> = ({ reports, onNewReport, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="data-list-container">
      <header className="list-header">
        <h2 className="list-title">Informes</h2>
        <div className="list-actions">
          <div className="search-wrapper">
            <span aria-hidden="true" className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar informes..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Buscar informes"
            />
          </div>
          <button onClick={onNewReport} className="btn-add">
            + Nuevo Informe
          </button>
        </div>
      </header>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha Creación</th>
              <th>URL Asociada</th>
              <th>Nombre del Informe</th>
              <th className="text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <tr key={report.id}>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    {report.url ? (
                         <a href={report.url} className="link-table" target="_blank" rel="noopener noreferrer">{report.url}</a>
                    ) : (
                        <span className="text-muted">Desconocida</span>
                    )}
                  </td>
                  <td><strong>{report.name || 'Sin nombre'}</strong></td>
                  <td className="text-right">
                    <button 
                        onClick={() => onDownload(report.id)} 
                        className="btn-icon" 
                        title="Descargar"
                        aria-label={`Descargar informe ${report.name}`}
                    >
                        📥
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-state">No se encontraron informes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaInforme;
