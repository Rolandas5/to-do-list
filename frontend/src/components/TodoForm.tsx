import { useState, FormEvent } from 'react';

interface TodoFormProps {
  addTodo: (text: string) => void;
}

export const TodoForm = ({ addTodo }: TodoFormProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addTodo(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Įrašykite užduotį"
      />
      <button type="submit">Pridėti</button>
    </form>
  );
};
