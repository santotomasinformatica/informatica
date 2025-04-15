// components/FileUploader.js
import React, { useRef } from 'react';

const FileUploader = ({ 
  selectedFiles, 
  onFileSelect, 
  onFileRemove, 
  onUpload, 
  uploadProgress 
}) => {
  const fileInputRef = useRef(null);

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
        onClick={onUpload}
        disabled={selectedFiles.length === 0}
      >
        Subir Archivos
      </button>
    </div>
  );
};

export default FileUploader;