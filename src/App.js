// App.js - Componente principal
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import './App.css';
import Carousel from './components/Carousel';
import FileUploader from './components/FileUploader';
import FileGallery from './components/FileGallery';
import LoadingOverlay from './components/LoadingOverlay';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMUj9uAbsqZGP2tlzNcEVWefGW4BzZqVc",
  authDomain: "bdpruebafinal.firebaseapp.com",
  databaseURL: "https://bdpruebafinal-default-rtdb.firebaseio.com",
  projectId: "bdpruebafinal",
  storageBucket: "bdpruebafinal.appspot.com",
  messagingSenderId: "85413415022",
  appId: "1:85413415022:web:d2cc4402e97145ad65be7f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
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

  // Función para subir archivos
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
        const fileId = Date.now() + '_' + file.name;
        const storagePath = `files/${fileId}`;
        const storageRef = ref(storage, storagePath);

        // Iniciar carga
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Promesa para manejar la carga
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Error al subir archivo:", error);
              reject(error);
            },
            async () => {
              try {
                // Carga completada
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Guardar información en Firestore
                await addDoc(filesCollectionRef, {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  url: downloadURL,
                  storagePath: storagePath,
                  timestamp: serverTimestamp()
                });

                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });

        // Actualizar progreso
        setUploadProgress((i + 1) / selectedFiles.length * 100);
      }

      // Limpiar y recargar
      setSelectedFiles([]);
      setUploadProgress(0);
      loadFiles();
    } catch (error) {
      console.error("Error general al subir archivos:", error);
      alert('Error al subir archivos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar archivo
  const deleteFile = async (id, path) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        // Eliminar de Storage
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        
        // Eliminar de Firestore
        await deleteDoc(doc(db, 'files', id));
        
        // Recargar archivos
        loadFiles();
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