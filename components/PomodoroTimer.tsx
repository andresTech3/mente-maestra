import React, { useState, useEffect, useCallback } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(WORK_MINUTES);
    setSeconds(0);
  }, []);
  
  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(s => s - 1);
        } else if (minutes > 0) {
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          if (isBreak) {
            // Break finished, start new work session
            setIsBreak(false);
            setMinutes(WORK_MINUTES);
            setSeconds(0);
          } else {
            // Work finished, start break
            setIsBreak(true);
            setMinutes(BREAK_MINUTES);
            setSeconds(0);
          }
          // Notify user
          new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3').play();
          // Keep timer running for next session
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) window.clearInterval(interval);
    }
    return () => {
      if(interval) window.clearInterval(interval)
    };
  }, [isActive, seconds, minutes, isBreak]);

  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const themeColor = isBreak ? 'bg-green-800' : 'bg-red-800';
  const buttonColor = isBreak ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className={`bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-500`}>
      <h3 className="text-lg font-bold text-white mb-2">Zona de Concentración</h3>
      <div className={`my-4 p-4 rounded-lg ${themeColor}`}>
        <p className="text-5xl font-mono font-bold text-white tracking-widest">{time}</p>
        <p className="text-sm text-gray-200 uppercase tracking-wider mt-1">{isBreak ? 'Descanso' : 'Sesión de Enfoque'}</p>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={toggle} className={`${buttonColor} text-white font-bold py-2 px-6 rounded-lg transition`}>
          {isActive ? 'Pausa' : 'Iniciar'}
        </button>
        <button onClick={reset} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition">
          Reiniciar
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;