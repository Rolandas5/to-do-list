import { useState, FormEvent } from 'react';

interface TodoFormProps {
  addTodo: (
    title: string,
    description: string,
    status: 'nebaigta' | 'atlikta'
  ) => void;
}

export const TodoForm = ({ addTodo }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'nebaigta' | 'atlikta'>('nebaigta');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      addTodo(title.trim(), description.trim(), status);
      setTitle('');
      setDescription('');
      setStatus('nebaigta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        className="todo-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Įrašykite pavadinimą"
        required
      />
      <textarea
        className="todo-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Įrašykite aprašymą"
        required
      />
      <select
        className="todo-select"
        value={status}
        onChange={(e) => setStatus(e.target.value as 'nebaigta' | 'atlikta')}
        required
      >
        <option value="nebaigta">Nebaigta</option>
        <option value="atlikta">Atlikta</option>
      </select>
      <button type="submit" className="todo-btn">
        Pridėti užduotį
      </button>
    </form>
  );
};
