import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const onAddTask = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onAddTask with title and description when form is submitted', () => {
    render(<TaskForm onAddTask={onAddTask} />);
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Task Description' },
    });
    fireEvent.click(addButton);

    expect(onAddTask).toHaveBeenCalledWith('New Task', 'Task Description');
  });

  test('should call onAddTask with title only when description is empty', () => {
    render(<TaskForm onAddTask={onAddTask} />);
    const titleInput = screen.getByLabelText('Title');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(onAddTask).toHaveBeenCalledWith('New Task', '');
  });

  test('should not call onAddTask when title is empty', () => {
    render(<TaskForm onAddTask={onAddTask} />);
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });
    fireEvent.click(addButton);
    expect(onAddTask).not.toHaveBeenCalled();
  });

  test('should clear the input fields after form submission', () => {
    render(<TaskForm onAddTask={onAddTask} />);
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Task Description' },
    });
    fireEvent.click(addButton);

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });
});
