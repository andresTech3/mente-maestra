import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Task, Subtask } from './types';
import { breakDownTask } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Terminar lectura de PSIC-101', dueDate: new Date(Date.now() + 86400000).toISOString(), completed: false, subtasks: [
      { id: '1-1', text: 'Leer Capítulo 1', completed: true },
      { id: '1-2', text: 'Leer Capítulo 2', completed: false },
      { id: '1-3', text: 'Resumir puntos clave', completed: false },
    ]},
    { id: '2', title: 'Prepararse para el parcial de Matemáticas', completed: false, subtasks: [
      { id: '2-1', text: 'Repasar apuntes de clase', completed: false },
      { id: '2-2', text: 'Completar problemas de práctica', completed: false },
      { id: '2-3', text: 'Asistir a la sesión de estudio grupal', completed: false },
    ]}
  ]);
  const [points, setPoints] = useState<number>(25);
  const [streak, setStreak] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['1'])); // Task '1' is expanded by default

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const now = new Date();
        tasks.forEach(task => {
          if (task.dueDate && !task.completed && new Date(task.dueDate) < now && !notifiedTasks.has(task.id)) {
            new Notification('¡Misión Vencida en Mente Maestra!', {
              body: `Tu misión "${task.title}" ha vencido. ¡No te rindas!`,
              icon: '/favicon.svg'
            });
            setNotifiedTasks(prev => new Set(prev).add(task.id));
          }
        });
      }
    }, 60000); // Revisa cada minuto

    return () => clearInterval(checkInterval);
  }, [tasks, notifiedTasks]);

  const handleAddTask = useCallback(async (title: string, dueDate?: string) => {
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      const subtaskTexts = await breakDownTask(title);
      const newSubtasks: Subtask[] = subtaskTexts.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        completed: false,
      }));
      const newTaskId = Date.now().toString();
      const newTask: Task = {
        id: newTaskId,
        title,
        dueDate,
        subtasks: newSubtasks,
        completed: false,
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setExpandedTasks(prev => new Set(prev).add(newTaskId)); // Expand new task by default
    } catch (error) {
        console.error("Failed to add task:", error);
        alert("Lo sentimos, hubo un error al agregar tu tarea. Por favor, inténtalo de nuevo.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          let subtaskCompleted = false;
          const newSubtasks = task.subtasks.map(subtask => {
            if (subtask.id === subtaskId) {
              subtaskCompleted = !subtask.completed;
              return { ...subtask, completed: !subtask.completed };
            }
            return subtask;
          });

          // Award points for subtask completion
          if (subtaskCompleted) {
            setPoints(p => p + 5);
          }

          const allSubtasksCompleted = newSubtasks.every(st => st.completed);
          if (allSubtasksCompleted && !task.completed) {
            // Award bonus for main task completion
            setPoints(p => p + 20);
            setStreak(s => s + 1);
            return { ...task, subtasks: newSubtasks, completed: true };
          }
          
          return { ...task, subtasks: newSubtasks, completed: allSubtasksCompleted };
        }
        return task;
      });
      return newTasks;
    });
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setNotifiedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  }, []);

  const handleToggleExpand = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  }, []);
  
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header points={points} streak={streak} />
        <main className="mt-8">
          <Dashboard
            tasks={tasks}
            points={points}
            isLoading={isLoading}
            onAddTask={handleAddTask}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            completedTasksCount={completedTasksCount}
            totalTasksCount={tasks.length}
            expandedTasks={expandedTasks}
            onToggleExpand={handleToggleExpand}
          />
        </main>
      </div>
    </div>
  );
};

export default App;