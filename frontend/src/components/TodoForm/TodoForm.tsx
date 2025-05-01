import { useState, FormEvent } from 'react';
import './todo-form.css';
import '../TodoWrapper/todo-modal.css';

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
        className="input-field"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Įrašykite pavadinimą"
        required
      />
      <textarea
        className="textarea-field"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Įrašykite aprašymą"
        required
      />
      <select
        className="select-field"
        value={status}
        onChange={(e) => setStatus(e.target.value as 'nebaigta' | 'atlikta')}
        required
      >
        <option value="nebaigta">Nebaigta</option>
        <option value="atlikta">Atlikta</option>
      </select>
      <button type="submit" className="submit-button">
        Pridėti užduotį
      </button>
    </form>
  );
};
