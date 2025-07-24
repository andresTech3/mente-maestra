import React, { useState } from 'react';
import { PlusIcon, SparklesIcon } from './icons';
import Spinner from './Spinner';

interface AddTaskFormProps {
  onAddTask: (title: string, dueDate?: string) => Promise<void>;
  isLoading: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleRequestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;
    
    let dueDate: string | undefined = undefined;
    if (date) {
        handleRequestNotificationPermission();
        if (time) {
            dueDate = new Date(`${date}T${time}`).toISOString();
        } else {
            // Si solo se da la fecha, se establece al final del día.
            dueDate = new Date(`${date}T23:59:59`).toISOString();
        }
    }

    onAddTask(title, dueDate);
    setTitle('');
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Escribir ensayo sobre estoicismo"
          className="w-full bg-gray-700 border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
           <SparklesIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          aria-label="Fecha de vencimiento"
        />
        <input 
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          aria-label="Hora de vencimiento"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {isLoading ? <Spinner /> : <PlusIcon className="w-5 h-5" />}
        <span className="ml-2">Añadir Misión</span>
      </button>
    </form>
  );
};

export default AddTaskForm;