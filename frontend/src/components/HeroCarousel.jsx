import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import img1 from "../assets/carousel/img1.png";
import img2 from "../assets/carousel/img2.png";
import img3 from "../assets/carousel/img3.png";
import img4 from "../assets/carousel/img4.png";
import img5 from "../assets/carousel/img5.png";

const HeroCarousel = () => {
  const images = [img1, img2, img3, img4, img5];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="md:mt-2 relative w-full overflow-hidden bg-white">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          className={`w-full h-auto mx-auto transition-opacity duration-1000
            ${index === current ? "opacity-100 relative" : "opacity-0 absolute"}`}
        />
      ))}

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2
          flex items-center justify-center
          sm:text-black
          w-10 h-10 sm:w-14 sm:h-14
          rounded-full 
          sm:bg-white sm:shadow-lg sm:hover:bg-gray-200
          transition"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2
          flex items-center justify-center
          sm:text-black
          w-10 h-10 sm:w-14 sm:h-14
          rounded-full 
          sm:bg-white sm:shadow-lg sm:hover:bg-gray-200
          transition"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1 md:w-2 h-1 md:h-2 rounded-full cursor-pointer ${
              index === current ? "bg-black" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
