import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tikrina ar vartotojas prisijungęs
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Užkrauna vartotojo užduotis
  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`${API_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then((res) => setTodos(res.data))
        .catch((err) => console.error('Klaida gaunant užduotis', err));
    }
  }, [isAuthenticated]);

  // Pridėti naują užduotį
  const addTodo = (
    title: string,
    description: string,
    status: 'nebaigta' | 'baigta'
  ) => {
    axios
      .post(
        `${API_URL}/api/todos`,
        { title, description, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .then((res) => {
        console.log('Sėkmingai pridėta:', res.data);
        setTodos((prev) => [...prev, res.data]);
      })
      .catch((err) => console.error('Klaida kuriant užduotį', err));
  };

  // Ištrinti užduotį
  const deleteTodo = (id: string) => {
    axios
      .delete(`${API_URL}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((err) => console.error('Klaida trinant užduotį', err));
  };

  // Atnaujinti užduotį
  const updateTodo = (id: string, updatedFields: Partial<TodoItem>) => {
    axios
      .put(`${API_URL}/api/todos/${id}/edit`, updatedFields, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      )
      .catch((err) => console.error('Klaida atnaujinant užduotį', err));
  };

  function normalizeText(text: string) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  const filteredTodos = todos.filter((todo) => {
    const normalizedTitle = normalizeText(todo.title);
    const normalizedDescription = normalizeText(todo.description);
    const normalizedSearch = normalizeText(searchText);

    return (
      normalizedTitle.includes(normalizedSearch) ||
      normalizedDescription.includes(normalizedSearch)
    );
  });

  return (
    <div className="TodoWrapper">
      <h1>Užduočių sąrašas</h1>

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
