import { useEffect, useState } from 'react';
import axios from 'axios';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';

interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/todos`).then((res) => setTodos(res.data));
  }, []);

  const addTodo = (text: string) => {
    axios
      .post(`${API_URL}/api/todos`, { text })
      .then((res) => setTodos([...todos, res.data]));
  };

  const deleteTodo = (id: string) => {
    axios
      .delete(`${API_URL}/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
  };

  const toggleTodo = (id: string) => {
    axios
      .put(`${API_URL}/api/todos/${id}`)
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      );
  };

  const updateTodo = (id: string, newText: string) => {
    axios
      .put(`${API_URL}/api/todos/${id}/edit`, { text: newText })
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      );
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchText.toLowerCase())
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
          onToggle={toggleTodo}
          onUpdate={updateTodo}
        />
      ))}
    </div>
  );
};
