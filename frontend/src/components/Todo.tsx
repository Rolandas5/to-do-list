import { useState } from 'react';

interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoProps {
  todo: TodoItem;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}

export const Todo = ({ todo, onDelete, onToggle, onUpdate }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [showAsCompleted, setShowAsCompleted] = useState(false);

  const handleEdit = () => {
    if (isEditing && editValue.trim()) {
      onUpdate(todo._id, editValue.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    setShowAsCompleted(true);
    setTimeout(() => {
      onDelete(todo._id);
    }, 1000); // parodymas 1s prieš ištrinant
  };

  return (
    <div className={`Todo ${todo.completed ? 'completed' : 'incompleted'}`}>
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
      ) : showAsCompleted ? (
        <code className="completed-code">{todo.text}</code>
      ) : (
        <p onClick={() => onToggle(todo._id)}>{todo.text}</p>
      )}

      <button className="edit-icon" onClick={handleEdit}>
        {isEditing ? '💾' : '✏️'}
      </button>
      <button className="delete-icon" onClick={handleDelete}>
        🗑️
      </button>
    </div>
  );
};
