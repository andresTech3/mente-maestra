import React, { useMemo } from 'react';
import { PlaytoState } from '../types';

interface PlaytoCompanionProps {
  points: number;
}

const PlaytoTired: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#4A5568"/>
    <circle cx="35" cy="45" r="5" fill="white"/>
    <circle cx="65" cy="45" r="5" fill="white"/>
    <path d="M35 65 Q50 55 65 65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M25 35 Q30 40 35 35" stroke="white" strokeWidth="2"/>
    <path d="M75 35 Q70 40 65 35" stroke="white" strokeWidth="2"/>
  </svg>
);

const PlaytoNeutral: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#A0AEC0"/>
    <circle cx="35" cy="45" r="6" fill="white"/>
    <circle cx="65" cy="45" r="6" fill="white"/>
    <path d="M35 65 H 65" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const PlaytoHappy: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#6366F1"/>
    <circle cx="35" cy="45" r="7" fill="white"/>
    <circle cx="65" cy="45" r="7" fill="white"/>
    <path d="M30 60 Q50 80 70 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const PlaytoCompanion: React.FC<PlaytoCompanionProps> = ({ points }) => {
  const { state, message } = useMemo(() => {
    if (points < 50) {
      return { state: PlaytoState.Tired, message: "Un poco de progreso cada día suma grandes resultados." };
    }
    if (points < 150) {
      return { state: PlaytoState.Neutral, message: "Mantén el esfuerzo constante. ¡Lo estás haciendo genial!" };
    }
    return { state: PlaytoState.Happy, message: "¡Estás imparable! ¡Trabajo increíble!" };
  }, [points]);

  const renderPlayto = () => {
    const props = { className: "w-24 h-24 mx-auto" };
    switch (state) {
      case PlaytoState.Tired:
        return <PlaytoTired {...props} />;
      case PlaytoState.Neutral:
        return <PlaytoNeutral {...props} />;
      case PlaytoState.Happy:
        return <PlaytoHappy {...props} />;
      default:
        return <PlaytoNeutral {...props} />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
      <h3 className="text-lg font-bold text-white mb-2">Tu Compañero, Playto</h3>
      <div className="my-4">{renderPlayto()}</div>
      <p className="text-sm text-gray-300 italic">"{message}"</p>
    </div>
  );
};

export default PlaytoCompanion;