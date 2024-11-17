'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const desktopSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};

const mobileSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  arrows: false,
  adaptiveHeight: true,
};

const Carousel = () => {
  const [images, setImages] = useState([]);
  const desktopSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      const imagePaths = [];
      for (let i = 1; i <= 20; i++) {
        const image = await import(`../../src/images/imagen_${i < 10 ? `0${i}` : i}.jpg`);
        imagePaths.push(image.default);
      }
      setImages(imagePaths);
    };

    loadImages();
  }, []);

  return (
    <div>
      {/* Carrusel original para pantallas grandes */}
      <div className="hidden md:block" style={{ height: '500px', width: '600px', margin: '0 auto' }}>
        <Slider ref={desktopSliderRef} {...desktopSettings} style={{ height: '100%', width: '100%' }}>
          {images.map((imgSrc, index) => (
            <div key={index} style={{ height: '100%', position: 'relative' }}>
              <Image
                src={imgSrc}
                alt={`Imagen ${index + 1}`}
                width={600}
                height={500}
                style={{
                  objectFit: 'cover', // Esto asegura que la imagen se recorte si es necesario
                  borderRadius: '12px',
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Carrusel para móviles */}
      <div className="md:hidden">
        <Slider ref={mobileSliderRef} {...mobileSettings}>
          {images.map((imgSrc, index) => (
            <div key={index} className="relative w-full h-[300px]">
              <Image
                src={imgSrc}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
