import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';
import { Task } from '../types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'Pending',
    progress: 0,
  };

  const onRun = vi.fn();
  const onCancel = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render correctly with Pending status', () => {
    render(<TaskItem task={mockTask} onRun={onRun} onCancel={onCancel} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeInTheDocument();
  });

  test('should render correctly with In Progress status', () => {
    render(
      <TaskItem
        task={{ ...mockTask, status: 'In Progress', progress: 50 }}
        onRun={onRun}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('should render correctly with Completed status', () => {
    render(
      <TaskItem
        task={{ ...mockTask, status: 'Completed' }}
        onRun={onRun}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('should render correctly with Cancelled status', () => {
    render(
      <TaskItem
        task={{ ...mockTask, status: 'Cancelled' }}
        onRun={onRun}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  test('should call onRun when Run button is clicked', () => {
    render(<TaskItem task={mockTask} onRun={onRun} onCancel={onCancel} />);
    const button = screen.getByRole('button', { name: 'Run' });
    fireEvent.click(button);
    expect(onRun).toHaveBeenCalledWith('1');
  });

  test('should call onCancel when Cancel button is clicked', () => {
    render(
      <TaskItem
        task={{ ...mockTask, status: 'In Progress', progress: 50 }}
        onRun={onRun}
        onCancel={onCancel}
      />
    );
    const button = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(button);
    expect(onCancel).toHaveBeenCalledWith('1');
  });
});
