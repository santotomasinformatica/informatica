// components/Carousel.js - Modificado para el nuevo enfoque
import React, { useState, useEffect, useCallback } from 'react';

const Carousel = ({ files }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  // Actualizar diapositivas cuando cambian los archivos
  useEffect(() => {
    if (files.length > 0) {
      setSlides(files);
      setActiveSlide(0);
    }
  }, [files]);

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
    if (slides.length === 0) return;
    
    const slideInterval = setInterval(() => {
      changeSlide('next');
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [changeSlide, slides.length]);

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

  return (
    <div className="carousel-container">
      <div className="carousel-slides">
        {slides.map((file, index) => (
          <div 
            key={file.id} 
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
          >
            {/* Usar la propiedad isImage para determinar el tipo en lugar de verificar el mime type */}
            {file.isImage ? (
              <img src={file.url} alt={file.name} />
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