type Status = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  progress?: number;
}
