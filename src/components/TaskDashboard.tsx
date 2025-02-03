import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm';
import { Task } from '../types';
import TaskItem from './TaskItem';
import api from '../api';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  //const timeoutsRef = useRef<Map<string, number>>(new Map());

  const handleAddTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'Pending',
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleRunTask = async (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'In Progress', progress: 0 }
          : task
      )
    );
    try {
      const response = await api.post(`/tasks/${taskId}/run`, null, {
        onUploadProgress: (event) => {
          const { loaded } = event;
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, progress: loaded } : task
            )
          );
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to run task');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: 'Completed', progress: 100 }
            : task
        )
      );
    } catch (error) {
      console.error(`Failed to run task ${taskId}`, error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'Pending' } : task
        )
      );
      return;
    }
  };

  const handleCancelTask = async (taskId: string) => {
    try {
      await api.post(`/tasks/${taskId}/cancel`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'Cancelled' } : task
        )
      );
    } catch (error) {
      console.error(`Failed to cancel task ${taskId}`, error);
      return;
    }
  };

  return (
    <div className="flex md:flex-row flex-col md:gap-4 gap-2">
      <div className="w-full md:w-1/2">
        <TaskForm onAddTask={handleAddTask} />
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onRun={handleRunTask}
            onCancel={handleCancelTask}
          />
        ))}
      </div>
    </div>
  );
}
