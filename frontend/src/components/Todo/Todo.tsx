import { useState } from 'react';
import './todo.css';

interface TodoItem {
  _id: string;
  title: string;
  description: string;
  status: 'nebaigta' | 'atlikta';
}

interface TodoProps {
  todo: TodoItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTodo: Partial<TodoItem>) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export const Todo = ({
  todo,
  onDelete,
  onUpdate,
  isSelected,
  onToggleSelect,
}: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editStatus, setEditStatus] = useState<'nebaigta' | 'atlikta'>(
    todo.status
  );
  const [showAsDeleted, setShowAsDeleted] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editDescription.trim()) {
      onUpdate(todo._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setShowAsDeleted(true);
    setTimeout(() => {
      onDelete(todo._id);
    }, 800);
  };

  const toggleComplete = () => {
    const newStatus = todo.status === 'nebaigta' ? 'atlikta' : 'nebaigta';
    onUpdate(todo._id, { status: newStatus });
  };

  return (
    <li
      className={`task-item ${todo.status === 'atlikta' ? 'completed' : ''} ${
        isSelected ? 'selected' : ''
      }`}
    >
      <input
        type="checkbox"
        className="task-checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(todo._id)}
      />

      <div className="todo-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Pavadinimas"
              className="todo-edit-input"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Aprašymas"
              className="todo-edit-textarea"
            />
            <select
              value={editStatus}
              onChange={(e) =>
                setEditStatus(e.target.value as 'nebaigta' | 'atlikta')
              }
              className="todo-edit-select"
            >
              <option value="nebaigta">Nebaigta</option>
              <option value="atlikta">Atlikta</option>
            </select>
          </>
        ) : showAsDeleted ? (
          <code className="completed-code">{todo.title}</code>
        ) : (
          <>
            <h3 onClick={toggleComplete}>{todo.title}</h3>
            <p>{todo.description}</p>
            <p className="todo-status" onClick={toggleComplete}>
              {todo.status}
            </p>
          </>
        )}
      </div>

      {!showAsDeleted && (
        <div className="todo-actions">
          {isEditing ? (
            <button className="save-icon" onClick={handleSave}>
              💾
            </button>
          ) : (
            <button className="edit-icon" onClick={() => setIsEditing(true)}>
              ✏️
            </button>
          )}
          <button className="delete-icon" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      )}
    </li>
  );
};
