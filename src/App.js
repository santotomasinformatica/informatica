// App.js - Usando Cloudinary en lugar de Firebase Storage
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import './App.css';

// Componentes
import Carousel from './components/Carousel';
import FileUploader from './components/FileUploader';
import FileGallery from './components/FileGallery';
import LoadingOverlay from './components/LoadingOverlay';

// Configuración de Firebase (solo para Firestore)
const firebaseConfig = {
  apiKey: "AIzaSyDV8e28v-uKwBNvkFUW4RwE6nS8i97NbK4",
  authDomain: "nacional-5ed0a.firebaseapp.com",
  projectId: "nacional-5ed0a",
  storageBucket: "nacional-5ed0a.firebasestorage.app",
  messagingSenderId: "1023598065322",
  appId: "1:1023598065322:web:5bbd9f0637ac55030442d3"
};

// Configuración de Cloudinary (reemplaza con tus credenciales)
// Puedes obtener esto registrándote en https://cloudinary.com/
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Cambia esto por tu upload preset
const CLOUDINARY_CLOUD_NAME = 'dkci8ferq'; // Cambia esto por tu cloud name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// Inicializar Firebase (solo Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const filesCollectionRef = collection(db, 'files');

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Cargar archivos al iniciar
  useEffect(() => {
    loadFiles();
  }, []);

  // Función para cargar archivos desde Firestore
  const loadFiles = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(filesCollectionRef);
      const filesData = [];
      
      querySnapshot.forEach((doc) => {
        filesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setFiles(filesData);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
      alert('Error al cargar archivos. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  // Función para manejar archivos seleccionados
  const handleFileSelect = (newFiles) => {
    const filesArray = Array.from(newFiles);
    setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
  };

  // Función para eliminar archivo seleccionado (antes de subir)
  const removeSelectedFile = (index) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, i) => i !== index)
    );
  };

  // Función para subir archivos a Cloudinary
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Preparar FormData para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'carousel-files');
        
        // Subir a Cloudinary usando Fetch API (sin problemas CORS)
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Error al subir a Cloudinary');
        }
        
        const cloudinaryData = await response.json();
        
        // Verificar tipo de archivo
        const isImage = file.type.startsWith('image/');
        
        // Guardar información en Firestore (solo metadatos)
        await addDoc(filesCollectionRef, {
          name: file.name,
          type: file.type,
          size: file.size,
          url: cloudinaryData.secure_url, // URL HTTPS de Cloudinary
          publicId: cloudinaryData.public_id, // ID público en Cloudinary (para eliminación)
          isImage: isImage,
          timestamp: serverTimestamp()
        });
        
        // Actualizar progreso
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Limpiar y recargar
      setSelectedFiles([]);
      setUploadProgress(0);
      await loadFiles();
    } catch (error) {
      console.error("Error al subir archivos:", error);
      alert('Error al subir archivos. Por favor, intenta de nuevo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar archivo
  const deleteFile = async (id, publicId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        // Eliminar de Cloudinary (requiere backend o función serverless)
        // Nota: Para una eliminación completa, necesitarías un backend que use la API Admin de Cloudinary
        // En esta implementación, solo eliminaremos la referencia de Firestore
        
        // Eliminar de Firestore
        await deleteDoc(doc(db, 'files', id));
        
        // Recargar archivos
        await loadFiles();
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
        alert('Error al eliminar el archivo. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="app">
      {loading && <LoadingOverlay progress={uploadProgress} />}
      
      {/* Carrusel a pantalla completa */}
      <Carousel files={files} />
      
      {/* Sección de carga y gestión de archivos */}
      <div className="upload-section">
        <h2>Gestión de Archivos</h2>
        
        <FileUploader 
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onFileRemove={removeSelectedFile}
          onUpload={uploadFiles}
          uploadProgress={uploadProgress}
        />
        
        <h2>Archivos Subidos</h2>
        <FileGallery files={files} onDelete={deleteFile} />
      </div>
    </div>
  );
}

export default App;