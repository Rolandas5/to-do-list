import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { TodoForm } from '../TodoForm/TodoForm';
import { Todo } from '../Todo/Todo';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './todo-wrapper.css';

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
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      console.error('Klaida gaunant užduotis', err);
    }
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'delete'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addTodo = async (
    title: string,
    description: string,
    status: 'nebaigta' | 'atlikta'
  ) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/todos`,
        { title, description, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setTodos((prev) => [...prev, res.data]);
      setIsModalOpen(false);
      showNotification('✅ Užduotis sėkmingai pridėta!', 'success');
    } catch (err) {
      console.error('Klaida kuriant užduotį', err);
      showNotification('❌ Klaida kuriant užduotį.', 'error');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      showNotification('🗑️ Užduotis sėkmingai ištrinta!', 'delete');
    } catch (err) {
      console.error('Klaida trinant užduotį', err);
      showNotification('❌ Klaida trinant užduotį.', 'error');
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<TodoItem>) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/todos/${id}/edit`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? res.data : todo))
      );
    } catch (err) {
      console.error('Klaida atnaujinant užduotį', err);
      showNotification('❌ Klaida atnaujinant užduotį.', 'error');
    }
  };

  const toggleSelectTodo = (id: string) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedTodos.length > 0) {
      setIsConfirmModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectedTodos.map((id) =>
          axios.delete(`${API_URL}/api/todos/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
        )
      );
      setTodos((prev) =>
        prev.filter((todo) => !selectedTodos.includes(todo._id))
      );
      setSelectedTodos([]);
      showNotification('🗑️ Pažymėtos užduotys ištrintos.', 'delete');
    } catch (err) {
      console.error('Klaida trinant pažymėtas užduotis', err);
      showNotification('❌ Klaida trinant pažymėtas užduotis.', 'error');
    }
    setIsConfirmModalOpen(false);
  };

  const normalizeText = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\u0300-\u036f/g, '')
      .toLowerCase();

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

      <h2 className="completed-count">
        ✅ Atliktos užduotys: {completedCount}
      </h2>
      <h2 className="incomplete-count">
        ⌛ Nebaigtos užduotys: {incompleteCount}
      </h2>

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

      <div className="top-bar">
        <div className="select-all-container">
          <label className="select-all-label">
            <input
              type="checkbox"
              className="select-all-checkbox"
              checked={
                selectedTodos.length === todos.length && todos.length > 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTodos(todos.map((todo) => todo._id));
                } else {
                  setSelectedTodos([]);
                }
              }}
            />
          </label>
        </div>

        <div className="middle-container">
          <button
            onClick={() => setIsModalOpen(true)}
            className="new-task-button"
          >
            Nauja užduotis
          </button>
        </div>

        <div className="right-container">
          {selectedTodos.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="delete-all-button"
            >
              🗑️ ({selectedTodos.length})
            </button>
          )}
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ar tikrai norite ištrinti pažymėtas užduotis?</h2>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-btn">
                Taip
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="cancel-btn"
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="tasks-container">
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className={`task-item ${
              todo.status === 'atlikta' ? 'completed' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTodos.includes(todo._id)}
              onChange={() => toggleSelectTodo(todo._id)}
              className="task-checkbox"
            />
            <Todo todo={todo} onDelete={deleteTodo} onUpdate={updateTodo} />
          </div>
        ))}
      </div>
    </div>
  );
};
