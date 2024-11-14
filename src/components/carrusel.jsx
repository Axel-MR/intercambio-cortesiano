"use client";

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};

const Carousel = () => {
  const [images, setImages] = useState([]);
  const sliderRef = useRef(null);

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
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
        width: '600px',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      <Slider ref={sliderRef} {...carouselSettings} style={{ height: '100%', width: '100%' }}>
        {images.map((imgSrc, index) => (
          <div key={index} style={{ height: '100%', position: 'relative' }}>
            <Image
              src={imgSrc}
              alt={`Imagen ${index + 1}`}
              width={600}
              height={300}
              style={{ borderRadius: '12px' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
