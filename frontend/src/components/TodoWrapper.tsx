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
  status: 'nebaigta' | 'atlikta';
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'delete';
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const completedCount = todos.filter(
    (todo) => todo.status === 'atlikta'
  ).length;
  const incompleteCount = todos.filter(
    (todo) => todo.status === 'nebaigta'
  ).length;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'delete'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addTodo = (
    title: string,
    description: string,
    status: 'nebaigta' | 'atlikta'
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
        setTodos((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        showNotification('✅ Užduotis sėkmingai pridėta!', 'success');
      })
      .catch((err) => {
        console.error('Klaida kuriant užduotį', err);
        showNotification('❌ Klaida kuriant užduotį.', 'error');
      });
  };

  const deleteTodo = (id: string) => {
    axios
      .delete(`${API_URL}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
        showNotification('🗑️ Užduotis ištrinta.', 'delete');
      })
      .catch((err) => {
        console.error('Klaida trinant užduotį', err);
        showNotification('❌ Klaida trinant užduotį.', 'error');
      });
  };

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
      .catch((err) => {
        console.error('Klaida atnaujinant užduotį', err);
        showNotification('❌ Klaida atnaujinant užduotį.', 'error');
      });
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

      {/* Užduočių statusų skaičiavimas */}
      <h2 className="completed-count">
        ✅ Atliktos užduotys: {completedCount}
      </h2>
      <h2 className="incomplete-count">
        ⌛ Nebaigtos užduotys: {incompleteCount}
      </h2>

      {/* Notification žinutė */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <input
        type="text"
        placeholder="Ieškoti užduočių..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="todo-input"
      />

      <button onClick={() => setIsModalOpen(true)} className="new-task-button">
        + Nauja užduotis
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <h2>Pridėti naują užduotį</h2>
            <TodoForm addTodo={addTodo} />
          </div>
        </div>
      )}

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
