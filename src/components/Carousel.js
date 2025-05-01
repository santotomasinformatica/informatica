// components/Carousel.js - Optimizado para mantener proporción de imagen con letterboxing
import React, { useState, useEffect, useCallback, useRef } from 'react';

const Carousel = ({ files }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  // Actualizar diapositivas cuando cambian los archivos
  useEffect(() => {
    if (files.length > 0 && isLoaded) {
      setSlides(files);
      setActiveSlide(0);
    }
  }, [files, isLoaded]);

  // Función para cargar las imágenes
  const handleLoadImages = () => {
    setIsLoaded(true);
  };

  // Función para cambiar diapositiva
  const changeSlide = useCallback((direction) => {
    if (slides.length === 0) return;
    
    if (direction === 'next') {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    } else {
      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides]);

  // Configurar cambio automático de diapositivas
  useEffect(() => {
    if (slides.length === 0 || !isLoaded) return;
    
    const slideInterval = setInterval(() => {
      changeSlide('next');
    }, 10000);
    
    return () => clearInterval(slideInterval);
  }, [changeSlide, slides.length, isLoaded]);

  // Renderizar mensaje cuando no hay archivos
  if (files.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide active">
          <div className="no-files-message">
            No hay archivos disponibles. Sube algunos en la sección inferior.
          </div>
        </div>
      </div>
    );
  }

  // Mostrar botón de carga si las imágenes no están cargadas
  if (!isLoaded) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide active">
          <div className="load-images-container">
            <button className="load-images-btn" onClick={handleLoadImages}>
              Ver imágenes
            </button>
            <p className="load-info">
              Haz clic para cargar el carrusel de imágenes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container" ref={containerRef}>
      <div className="carousel-slides">
        {slides.map((file, index) => (
          <div 
            key={file.id} 
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
          >
            {file.isImage ? (
              <div className="letterbox-container">
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="letterboxed-image"
                  loading="lazy"
                />
              </div>
            ) : (
              <video autoPlay muted loop>
                <source src={file.url} />
                Tu navegador no soporta la reproducción de videos.
              </video>
            )}
          </div>
        ))}
      </div>
      
      <div className="carousel-buttons">
        <button 
          className="carousel-button prev" 
          onClick={() => changeSlide('prev')}
        >
          ←
        </button>
        <button 
          className="carousel-button next" 
          onClick={() => changeSlide('next')}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Carousel;