// components/FileUploader.js - Con protección de contraseña
import React, { useRef, useState } from 'react';

const FileUploader = ({ 
  selectedFiles, 
  onFileSelect, 
  onFileRemove, 
  onUpload, 
  uploadProgress 
}) => {
  const fileInputRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Contraseña correcta
  const correctPassword = 'lia-st2025';

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Maneja el click en el botón "Subir Archivos"
  const handleUploadClick = () => {
    setPasswordError('');
    setShowPasswordModal(true);
  };

  // Verifica la contraseña y sube los archivos
  const verifyPasswordAndUpload = () => {
    if (password === correctPassword) {
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      onUpload();
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  // Cierra el modal
  const closeModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  // Renderizar previsualizaciones de archivos seleccionados
  const renderFilePreviews = () => {
    return selectedFiles.map((file, index) => (
      <div className="selected-file-item" key={index}>
        {file.type.startsWith('image/') ? (
          <img src={URL.createObjectURL(file)} alt={file.name} />
        ) : file.type.startsWith('video/') ? (
          <video>
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
        ) : (
          <div className="file-icon">{file.name.split('.').pop()}</div>
        )}
        <button 
          className="remove-file" 
          onClick={() => onFileRemove(index)}
        >
          ×
        </button>
        <div className="file-type-label">
          {file.type.startsWith('image/') ? 'Imagen' : 'Video'}
        </div>
      </div>
    ));
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
            <p>Ingrese la contraseña para subir archivos:</p>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Contraseña"
              onKeyPress={(e) => {
                if (e.key === 'Enter') verifyPasswordAndUpload();
              }}
            />
            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}
          </div>
          <div className="password-modal-footer">
            <button className="cancel-btn" onClick={closeModal}>Cancelar</button>
            <button className="submit-btn" onClick={verifyPasswordAndUpload}>Aceptar</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="upload-form">
      <div className="form-group">
        <label htmlFor="file-upload">Seleccionar archivo</label>
        <div 
          className="file-input"
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Haz clic aquí o arrastra para seleccionar imágenes o videos</p>
          <input 
            type="file" 
            id="file-upload" 
            ref={fileInputRef}
            accept="image/*,video/*" 
            multiple
            onChange={handleFileInputChange}
          />
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="selected-files-preview">
            {renderFilePreviews()}
          </div>
        )}
        
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      <button 
        type="button" 
        className="upload-btn"
        onClick={handleUploadClick}
        disabled={selectedFiles.length === 0}
      >
        Subir Archivos
      </button>
      
      {renderPasswordModal()}
    </div>
  );
};

export default FileUploader;