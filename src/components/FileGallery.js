// components/FileGallery.js - Con protección de contraseña para eliminar
import React, { useState } from 'react';

const FileGallery = ({ files, onDelete }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  
  // Contraseña correcta
  const correctPassword = 'lia-st2025';
  
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

  // Función para cargar las imágenes
  const handleLoadImages = () => {
    setImagesLoaded(true);
  };

  // Iniciar el proceso de eliminación con verificación de contraseña
  const handleDeleteClick = (fileId, storagePath) => {
    setFileToDelete({ id: fileId, storagePath });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  // Verifica la contraseña y elimina el archivo
  const verifyPasswordAndDelete = () => {
    if (password === correctPassword) {
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      if (fileToDelete) {
        onDelete(fileToDelete.id, fileToDelete.storagePath);
        setFileToDelete(null);
      }
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  // Cierra el modal
  const closeModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
    setFileToDelete(null);
  };

  // Renderiza el modal de contraseña
  const renderPasswordModal = () => {
    if (!showPasswordModal) return null;

    return (
      <div className="password-modal-overlay">
        <div className="password-modal">
          <div className="password-modal-header">
            <h3>Ingrese la contraseña</h3>
            <button className="close-modal" onClick={closeModal}>×</button>
          </div>
          <div className="password-modal-body">
            <p>Ingrese la contraseña para eliminar el archivo:</p>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Contraseña"
              onKeyPress={(e) => {
                if (e.key === 'Enter') verifyPasswordAndDelete();
              }}
            />
            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}
          </div>
          <div className="password-modal-footer">
            <button className="cancel-btn" onClick={closeModal}>Cancelar</button>
            <button className="submit-btn" onClick={verifyPasswordAndDelete}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  };

  // Si las imágenes no están cargadas, mostrar botón
  if (!imagesLoaded) {
    return (
      <div className="files-gallery">
        <div className="gallery-load-container">
          <button className="load-images-btn" onClick={handleLoadImages}>
            Ver imágenes de la galería
          </button>
          <p className="load-info">
            Haz clic para cargar la galería de imágenes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="files-gallery">
      {files.map((file) => (
        <div className="file-item" key={file.id}>
          <div className="file-preview">
            {file.isImage ? (
              <img src={file.url} alt={file.name} />
            ) : (
              <video controls>
                <source src={file.url} />
                Tu navegador no soporta la reproducción de videos.
              </video>
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
                onClick={() => handleDeleteClick(file.id, file.storagePath)}
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
      
      {renderPasswordModal()}
    </div>
  );
};

export default FileGallery;