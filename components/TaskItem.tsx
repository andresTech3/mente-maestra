
import React from 'react';
import { Task } from '../types';
import { CheckIcon, TrashIcon, ClockIcon, ChevronDownIcon } from './icons';

interface TaskItemProps {
  task: Task;
  isExpanded: boolean;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleExpand: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isExpanded, onToggleSubtask, onDeleteTask, onToggleExpand }) => {
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  
  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }) : null;

  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${task.completed ? 'bg-green-500/10' : 'bg-gray-700/50'} ${isOverdue ? 'border-2 border-red-500/50' : 'border-2 border-transparent'}`}>
      <div className="flex justify-between items-start space-x-2">
        <button
          onClick={() => onToggleExpand(task.id)}
          aria-expanded={isExpanded}
          aria-controls={`subtasks-${task.id}`}
          className="flex-grow flex items-start space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md -m-2 p-2 w-full"
        >
          <div
            className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 ${
              task.completed
                ? 'bg-green-500'
                : 'bg-gray-600 border-2 border-gray-500'
            }`}
          >
            {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-grow">
            <span className={`font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
              {task.title}
            </span>
            {formattedDate && (
              <div className={`flex items-center mt-1 text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                <ClockIcon className="w-3 h-3 mr-1.5" />
                <span>Vence: {formattedDate}</span>
              </div>
            )}
          </div>
          <div className="flex items-center self-center pl-2">
             <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id);
          }} 
          className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0 p-1 rounded-full self-start"
          aria-label={`Eliminar la misión ${task.title}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div id={`subtasks-${task.id}`} className="pl-9 mt-3 space-y-2">
          {task.subtasks.map(subtask => (
            <div key={subtask.id} className="flex items-center">
              <input
                type="checkbox"
                id={`subtask-${subtask.id}`}
                checked={subtask.completed}
                onChange={() => onToggleSubtask(task.id, subtask.id)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-600 ring-offset-gray-800 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor={`subtask-${subtask.id}`}
                className={`ml-3 text-sm cursor-pointer ${
                  subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'
                }`}
              >
                {subtask.text}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;