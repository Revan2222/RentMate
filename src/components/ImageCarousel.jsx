import { useState, useRef, useEffect } from 'react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);
  
  const goToSlide = (index) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this to the CSS transition duration
  };
  
  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };
  
  const goToNextSlide = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };
  
  // Touch event handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    // Minimum distance required for swipe detection
    const minSwipeDistance = 50;
    const distance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      // Swiped left, go to next slide
      goToNextSlide();
    } else {
      // Swiped right, go to previous slide
      goToPrevSlide();
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };
    
    if (carouselRef.current) {
      carouselRef.current.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentIndex]);
  
  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <div className="placeholder-text">No images available</div>
      </div>
    );
  }
  
  return (
    <div 
      className="carousel" 
      ref={carouselRef}
      tabIndex="0" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
            aria-hidden={index !== currentIndex}
          >
            <img src={image} alt={`${title} - Image ${index + 1}`} className="carousel-image" />
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-control prev" 
        onClick={goToPrevSlide}
        aria-label="Previous image"
      >
        &#10094;
      </button>
      
      <button 
        className="carousel-control next" 
        onClick={goToNextSlide}
        aria-label="Next image"
      >
        &#10095;
      </button>
      
      <div className="carousel-thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>
      
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;