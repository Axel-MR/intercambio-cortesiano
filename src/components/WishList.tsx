"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface WishListProps {
  titulo: string;
  sorteoId: string;
}

export default function WishList({ titulo, sorteoId }: WishListProps) {
  const [texto, setTexto] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const formatTextoConLinks = (texto: string) => {
    // Primero, aseguramos que el texto se divida en líneas, pero procesamos cada línea individualmente
    const lines = texto.split('\n');
    return lines.map(line => {
      // Expresión regular para detectar enlaces
      const urlRegex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
      
      // Reemplazamos las URLs por los enlaces HTML
      line = line.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`;
      });
  
      // Ahora, aseguramos que la línea termine con un salto de línea solo si no es parte de un enlace
      if (!line.match(urlRegex)) {
        line += '<br>';
      }
  
      return line;
    }).join('');
  };

  // Obtén el texto desde Firestore cuando el componente se monta probando cambios
  useEffect(() => {
    const fetchTexto = async () => {
      try {
        const docRef = doc(db, 'configuracion', sorteoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTexto(docSnap.data().texto || '');
        } else {
          console.log('No se encontró el documento, creándolo...');
          await setDoc(docRef, { texto: '' });
          setTexto('');
        }
      } catch (error) {
        console.error('Error al obtener el texto desde Firestore:', error);
      }
    };

    if (sorteoId) {
      fetchTexto();
    }
  }, [sorteoId]);

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const guardarTexto = async () => {
    try {
      const docRef = doc(db, 'configuracion', sorteoId);
      await setDoc(docRef, { texto });
      setIsEditable(false);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error al guardar el texto en Firestore:', error);
    }
  };

  return (
    <div className="space-y-8 w-full mx-auto">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-[#d06522] text-white p-2 rounded-md shadow-md z-50">
          ¡Actualizado: Te rugieron las tripas con esa petición!
        </div>
      )}

      <h2 className="font-markazi text-3xl text-black text-center relative">
        <span className="absolute inset-0 text-white text-shadow">{titulo}</span>
        {titulo}
      </h2>

      <div className="bg-[#222222] rounded-xl p-4 text-white w-full max-w-2xl mx-auto">
        {isEditable ? (
          <div className="relative">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const cursorPosition = e.currentTarget.selectionStart;
                  const textBeforeCursor = texto.substring(0, cursorPosition);
                  const textAfterCursor = texto.substring(cursorPosition);
                  setTexto(textBeforeCursor + '\n' + textAfterCursor);
                }
              }}
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-black resize-none max-h-[400px] h-[400px] overflow-y-auto whitespace-pre-wrap"
            />
          </div>
        ) : (
          <div
            className="w-full rounded-md p-2 bg-white text-black overflow-y-auto overflow-x-auto max-h-[400px] h-[400px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatTextoConLinks(texto) }}
          />
        )}
        <div className="flex justify-between mt-4">
          {isEditable ? (
            <button 
              onClick={guardarTexto}
              className="px-4 py-2 bg-white text-black rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors"
            >
              Guardar
              <FontAwesomeIcon icon={faFloppyDisk} className="ml-2 text-[#5b2d22] text-xl" />
            </button>
          ) : (
            <button 
              onClick={toggleEditable}
              className="px-4 py-2 bg-white text-[#7c2e1b] rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors"
            >
              Editar
              <FontAwesomeIcon icon={faPenToSquare} className="ml-2 text-[#7c2e1b] text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}