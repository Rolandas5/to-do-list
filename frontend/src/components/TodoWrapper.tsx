import { useEffect, useState } from 'react';
import axios from 'axios';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';

interface TodoItem {
  _id: string;
  title: string;
  description: string;
  status: 'nebaigta' | 'baigta';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/todos`).then((res) => setTodos(res.data));
  }, []);

  const addTodo = (
    title: string,
    description: string,
    status: 'nebaigta' | 'baigta'
  ) => {
    axios
      .post(`${API_URL}/api/todos`, { title, description, status })
      .then((res) => setTodos([...todos, res.data]));
  };

  const deleteTodo = (id: string) => {
    axios
      .delete(`${API_URL}/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
  };

  const updateTodo = (id: string, updatedFields: Partial<TodoItem>) => {
    axios
      .put(`${API_URL}/api/todos/${id}/edit`, updatedFields)
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      );
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="TodoWrapper">
      <h1>Užduočių sąrašas</h1>
      <h2 className="task-count">Užduočių skaičius: {todos.length}</h2>

      <input
        type="text"
        placeholder="Ieškoti užduočių..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="todo-input"
      />

      <TodoForm addTodo={addTodo} />

      {filteredTodos.map((todo) => (
        <Todo
          key={todo._id}
          todo={todo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      ))}
    </div>
  );
};
