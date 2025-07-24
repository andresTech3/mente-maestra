
import React from 'react';
import { Task } from '../types';
import TaskList from './TaskList';
import PlaytoCompanion from './PlaytoCompanion';
import PomodoroTimer from './PomodoroTimer';
import EmotionalSupport from './EmotionalSupport';

interface DashboardProps {
  tasks: Task[];
  points: number;
  isLoading: boolean;
  onAddTask: (title: string, dueDate?: string) => Promise<void>;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TaskList {...props} />
      </div>
      <div className="space-y-6">
        <PlaytoCompanion points={props.points} />
        <PomodoroTimer />
        <EmotionalSupport />
      </div>
    </div>
  );
};

export default Dashboard;