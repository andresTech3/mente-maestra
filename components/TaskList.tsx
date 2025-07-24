import React from 'react';
import { Task } from '../types';
import AddTaskForm from './AddTaskForm';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: (title: string, dueDate?: string) => Promise<void>;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, onAddTask, onToggleSubtask, onDeleteTask, completedTasksCount, totalTasksCount, expandedTasks, onToggleExpand }) => {
  const progress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-full">
      <h2 className="text-xl font-bold text-white mb-2">Mis Misiones</h2>
      <p className="text-sm text-gray-400 mb-4">Desglosa tu trabajo y conquista tus metas un paso a la vez.</p>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-indigo-300">Progreso</span>
          <span className="text-sm font-medium text-indigo-300">{completedTasksCount} / {totalTasksCount} completadas</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <AddTaskForm onAddTask={onAddTask} isLoading={isLoading} />
      
      <div className="mt-4 space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              isExpanded={expandedTasks.has(task.id)}
              onToggleSubtask={onToggleSubtask} 
              onDeleteTask={onDeleteTask}
              onToggleExpand={onToggleExpand}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">Aún no hay misiones. ¡Agrega una para comenzar tu aventura!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;