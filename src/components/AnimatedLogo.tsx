'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import logo_00 from '../images/logo_00.png'

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  const [currentLogo, setCurrentLogo] = useState(logo_00)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [availableLogos, setAvailableLogos] = useState<number[]>(Array.from({ length: 25 }, (_, i) => i + 1))

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const handleLogoClick = async () => {
    if (availableLogos.length === 0) {
      setAvailableLogos(Array.from({ length: 25 }, (_, i) => i + 1))
    }

    const randomIndex = Math.floor(Math.random() * availableLogos.length)
    const logoNumber = availableLogos[randomIndex]

    if (logoNumber !== undefined) {
      try {
        const newLogo = await import(`../images/logo_${logoNumber < 10 ? '0' : ''}${logoNumber}.png`)
        setCurrentLogo(newLogo.default)

        setAvailableLogos((prev) => prev.filter((num) => num !== logoNumber))

        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(() => {
          setCurrentLogo(logo_00)
          timeoutId.current = null
        }, 5000)
      } catch (error) {
        console.error("Error cargando la imagen:", error)
      }
    } else {
      console.warn("El número de logo es undefined, por lo que no se puede cargar la imagen.")
    }
  }

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <div className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1600px] p-2 sm:p-4">
        <Image
          src={currentLogo}
          alt="Animated Logo"
          onClick={handleLogoClick}
          className="cursor-pointer w-full h-auto"
          width={1600}
          height={1600}
          sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, (max-width: 1280px) 80vw, 1600px"
          priority
        />
      </div>
    </div>
  )
}