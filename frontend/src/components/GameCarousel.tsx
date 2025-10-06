import React, { useState, useEffect } from 'react';
import '../styles/main.css';

interface Game {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface GameCarouselProps {
  games: Game[];
}

const GameCarousel = ({ games }: GameCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, games.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? games.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % games.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (games.length === 0) {
    return <div className="carousel-placeholder">暂无推荐游戏</div>;
  }

  return (
    <div 
      className="game-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="carousel-container">
        <div 
          className="carousel-slides"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="carousel-slide">
              <div className="slide-content">
                <div className="slide-image-container">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="slide-info">
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="carousel-button prev" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="carousel-button next" onClick={goToNext}>
        &#10095;
      </button>
    </div>
  );
};

export default GameCarousel;