import React, { useState } from 'react';
import { getEmotionalSupport } from '../services/geminiService';
import { BrainIcon } from './icons';
import Spinner from './Spinner';

const EmotionalSupport: React.FC = () => {
  const [feeling, setFeeling] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim()) return;
    setIsLoading(true);
    setResponse('');
    const aiResponse = await getEmotionalSupport(feeling);
    setResponse(aiResponse);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <BrainIcon className="w-6 h-6 text-teal-400 mr-3" />
        <h3 className="text-lg font-bold text-white">Momento de Calma</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">¿Te sientes abrumado? Describe lo que piensas y obtén un ejercicio rápido de apoyo.</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="Ej: Estoy ansioso por mi próximo examen..."
          className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition resize-none h-24"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !feeling.trim()}
          className="w-full mt-3 flex items-center justify-center bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {isLoading ? <Spinner /> : 'Recibir Consejo'}
        </button>
      </form>
      
      {(isLoading || response) && (
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
          {isLoading ? (
            <div className="flex items-center text-gray-300">
              <Spinner /> <span className="ml-2">Playto está pensando...</span>
            </div>
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4 text-center">Aviso: Esto no es un consejo médico. Para obtener ayuda profesional, consulta a un terapeuta.</p>
    </div>
  );
};

export default EmotionalSupport;