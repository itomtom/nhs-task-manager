import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import TaskDashboard from './TaskDashboard';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ status: 200 }),
  },
}));

describe('TaskDashboard', () => {
  test('should add a new task', () => {
    render(<TaskDashboard />);

    const titleInput = screen.getByLabelText('Title');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('runs a task and updates its status', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 200 });
    render(<TaskDashboard />);

    const titleInput = screen.getByLabelText('Title');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(addButton);

    const runButton = await screen.findByRole('button', { name: 'Run' });
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  test('should cancel a task and updates its status', async () => {
    (api.post as Mock)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ status: 200 }), 10)
          )
      ) // Simulates task running
      .mockResolvedValueOnce({ status: 200 }); // Simulates task cancellation
    render(<TaskDashboard />);

    const titleInput = screen.getByLabelText('Title');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'Task to Cancel' } });
    fireEvent.click(addButton);

    const runButton = await screen.findByRole('button', { name: 'Run' });
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    const cancelButton = await screen.findByRole('button', {
      name: 'Cancel',
    });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });
  });

  test('should update progress when running a task', async () => {
    render(<TaskDashboard />);

    const titleInput = screen.getByLabelText('Title');
    const addButton = screen.getByRole('button', {
      name: 'Add Task',
    });

    fireEvent.change(titleInput, { target: { value: 'Progress Task' } });
    fireEvent.click(addButton);

    let progressCallback: (progressEvent: ProgressEvent) => void;
    (api.post as Mock).mockImplementationOnce((_url, _data, config) => {
      progressCallback = config?.onUploadProgress;
      return new Promise((resolve) => {
        setTimeout(() => progressCallback?.({ loaded: 50 } as ProgressEvent));
        setTimeout(() => progressCallback?.({ loaded: 100 } as ProgressEvent));
        setTimeout(() => resolve({ status: 200 }), 10);
      });
    });

    const runButton = await screen.findByRole('button', { name: 'Run' });
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/50%/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/100%/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });
});
