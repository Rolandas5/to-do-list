import { useState } from 'react';

interface TodoItem {
  _id: string;
  title: string;
  description: string;
  status: 'nebaigta' | 'baigta';
}

interface TodoProps {
  todo: TodoItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTodo: Partial<TodoItem>) => void;
}

export const Todo = ({ todo, onDelete, onUpdate }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editStatus, setEditStatus] = useState<'nebaigta' | 'baigta'>(
    todo.status
  );
  const [showAsDeleted, setShowAsDeleted] = useState(false);

  const handleEditSave = () => {
    if (isEditing) {
      onUpdate(todo._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    setShowAsDeleted(true);
    setTimeout(() => {
      onDelete(todo._id);
    }, 1000);
  };

  return (
    <div
      className={`Todo ${
        todo.status === 'baigta' ? 'completed' : 'incompleted'
      }`}
    >
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
                setEditStatus(e.target.value as 'nebaigta' | 'baigta')
              }
              className="todo-edit-select"
            >
              <option value="nebaigta">Nebaigta</option>
              <option value="baigta">Baigta</option>
            </select>
          </>
        ) : showAsDeleted ? (
          <code className="completed-code">{todo.title}</code>
        ) : (
          <>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p className="todo-status">Statusas: {todo.status}</p>
          </>
        )}
      </div>

      <div className="todo-actions">
        <button className="edit-icon" onClick={handleEditSave}>
          {isEditing ? '💾' : '✏️'}
        </button>
        <button className="delete-icon" onClick={handleDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
};
