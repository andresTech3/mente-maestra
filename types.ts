
export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  subtasks: Subtask[];
  completed: boolean;
}

export enum PlaytoState {
  Tired = 'Tired',
  Neutral = 'Neutral',
  Happy = 'Happy',
}