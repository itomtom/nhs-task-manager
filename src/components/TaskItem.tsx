import classNames from 'classnames';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onRun: (id: string) => void;
  onCancel: (id: string) => void;
}

function TaskItem({ task, onRun, onCancel }: TaskItemProps) {
  const { id, title, description, status, progress } = task;

  return (
    <div className="p-3 border-1 rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
      <p className="text-neutral-100 mb-4">{description}</p>
      <div className="flex justify-between items-center gap-2">
        <span
          className={`px-4 py-1 rounded-full font-semibold text-sm ${
            status === 'Completed'
              ? 'bg-success-400 text-success-200'
              : status === 'In Progress'
                ? 'bg-primary-400 text-primary-100'
                : status === 'Cancelled'
                  ? 'bg-error-400 text-error-200'
                  : 'bg-neutral-200 text-neutral-100'
          }`}
        >
          {task.status}
        </span>
        {status === 'In Progress' && (
          <div className="bg-neutral-300 w-1/2 rounded-full">
            <div
              className={`bg-primary-300 text-white rounded-full text-center text-sm font-medium leading-none py-1 ${classNames(
                {
                  'ml-2': progress === 0,
                }
              )}`}
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}
        <div>
          {task.status === 'Pending' && (
            <button
              onClick={() => onRun(id)}
              className="w-full bg-success-100 text-white py-2 px-6 rounded-lg hover:bg-success-200 focus:outline-2 focus:outline-offset-2 focus:outline-success-300"
            >
              Run
            </button>
          )}
          {task.status === 'In Progress' && (
            <button
              onClick={() => onCancel(id)}
              className="w-full bg-error-100 text-white py-2 px-6 rounded-lg hover:bg-error-200 focus:outline-2 focus:outline-offset-2 focus:outline-error-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
