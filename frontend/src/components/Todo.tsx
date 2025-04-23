interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoProps {
  todo: TodoItem;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const Todo = ({ todo, onDelete, onToggle }: TodoProps) => {
  return (
    <div className={`Todo ${todo.completed ? 'completed' : ''}`}>
      <p onClick={() => onToggle(todo._id)}>{todo.text}</p>
      <button onClick={() => onDelete(todo._id)}>🗑️</button>
    </div>
  );
};
