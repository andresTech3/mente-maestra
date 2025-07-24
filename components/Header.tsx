import React from 'react';
import { TrophyIcon, BookOpenIcon, FireIcon } from './icons';

interface HeaderProps {
  points: number;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ points, streak }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <BookOpenIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Mente Maestra</h1>
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6 mt-4 sm:mt-0 bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="w-6 h-6 text-yellow-400" />
          <div className="text-left">
            <p className="text-sm font-bold text-white">{points}</p>
            <p className="text-xs text-gray-400">Puntos</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-600"></div>
        <div className="flex items-center space-x-2">
          <FireIcon className="w-6 h-6 text-orange-500" />
          <div className="text-left">
            <p className="text-sm font-bold text-white">{streak}</p>
            <p className="text-xs text-gray-400">Racha Diaria</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;