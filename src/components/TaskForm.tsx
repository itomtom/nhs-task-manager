import { FormEvent, useRef } from 'react';

interface TaskFormProps {
  onAddTask: (title: string, description?: string) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value.trim();
    const description = descriptionRef.current?.value.trim();

    if (!title) {
      // this should never happen as there are validation
      // but in case it does, we can return early
      return;
    }
    onAddTask(title, description);

    if (titleRef.current) titleRef.current.value = '';
    if (descriptionRef.current) descriptionRef.current.value = '';
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border-1 p-6 rounded-xl shadow-sm"
    >
      <div className="relative mt-4 pb-3">
        <input
          className="w-full border p-2 rounded peer placeholder:text-transparent"
          name="title"
          id="title"
          ref={titleRef}
          type="text"
          placeholder="Enter task title"
          required
        />
        <label
          htmlFor="title"
          className="absolute text-neutral-500 duration-300 ease-in-out transform -translate-y-6 left-0 py-0 text-sm font-medium peer-focus:py-0 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:text-primary-100 peer-focus:font-medium peer-focus:text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:py-2 peer-placeholder-shown:left-2 peer-placeholder-shown:font-normal peer-placeholder-shown:text-base"
        >
          Title
        </label>
      </div>

      <div className="relative mt-4 pb-3">
        <textarea
          className="w-full border p-2 rounded peer placeholder:text-transparent"
          name="description"
          id="description"
          ref={descriptionRef}
          placeholder="Enter task description"
        />
        <label
          htmlFor="description"
          className="absolute text-neutral-500 duration-300 ease-in-out transform -translate-y-6 left-0 py-0 text-sm font-medium peer-focus:py-0 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:text-primary-100 peer-focus:font-medium peer-focus:text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:py-2 peer-placeholder-shown:left-2 peer-placeholder-shown:font-normal peer-placeholder-shown:text-base"
        >
          Description
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-primary-100 text-white py-2 px-4 rounded-lg hover:bg-primary-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary-300"
      >
        Add Task
      </button>
    </form>
  );
}
