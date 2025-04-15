// components/FileGallery.js
import React from 'react';

const FileGallery = ({ files, onDelete }) => {
  // Si no hay archivos, mostrar mensaje
  if (files.length === 0) {
    return <p className="no-files">No hay archivos disponibles.</p>;
  }
  
  // Abrir archivo en nueva pestaña
  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };
  
  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    // Si es un objeto Firestore Timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    
    // Si es un objeto Date o timestamp normal
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="files-gallery">
      {files.map((file) => (
        <div className="file-item" key={file.id}>
          <div className="file-preview">
            {file.type.startsWith('image/') ? (
              <img src={file.url} alt={file.name} />
            ) : file.type.startsWith('video/') ? (
              <video controls>
                <source src={file.url} type={file.type} />
                Tu navegador no soporta la reproducción de videos.
              </video>
            ) : (
              <div className="unsupported-file">
                Formato no soportado
              </div>
            )}
          </div>
          
          <div className="file-info">
            <div className="file-name">{file.name}</div>
            <div className="file-date">
              Subido: {formatDate(file.timestamp)}
            </div>
            <div className="file-actions">
              <button 
                className="delete-btn" 
                onClick={() => onDelete(file.id, file.storagePath)}
              >
                Eliminar
              </button>
              <button 
                className="view-btn" 
                onClick={() => handleViewFile(file.url)}
              >
                Ver
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGallery;