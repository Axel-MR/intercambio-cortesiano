"use client";  // Directive to indicate the component is client-side

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ReglasProps {
  titulo: string;
  sorteoId: string;
}

const Reglas: React.FC<ReglasProps> = ({ titulo, sorteoId }) => {
  const [texto, setTexto] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

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
      console.log('Texto guardado en Firestore:', texto);
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
    <div className="space-y-4">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-[#d06522] text-white p-2 rounded-md shadow-md z-50">
          ¡Reglas actualizada!
        </div>
      )}

      <h2 className="font-markazi text-3xl text-black text-center relative">
        <span className="absolute inset-0 text-white text-shadow">{titulo}</span>
        {titulo}
      </h2>

      <div className="bg-[#222222] rounded-xl p-8 text-white w-full h-90">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={14}
          readOnly={!isEditable}
          className="w-full rounded-md border border-gray-300 p-2 bg-white text-black resize-none mt-4"
        />
        <div className="flex justify-between mt-4">
          {isEditable ? (
            <button 
              onClick={guardarTexto}
              className="px-4 py-2 bg-white text-[#5b2d22] rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors"
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
};

export default Reglas;
