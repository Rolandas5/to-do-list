import { useEffect, useState } from 'react';
import axios from 'axios';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';

interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
}

export const TodoWrapper = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/todos')
      .then((res) => setTodos(res.data));
  }, []);

  const addTodo = (text: string) => {
    axios
      .post('http://localhost:3001/api/todos', { text })
      .then((res) => setTodos([...todos, res.data]));
  };

  const deleteTodo = (id: string) => {
    axios
      .delete(`http://localhost:3001/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
  };

  const toggleTodo = (id: string) => {
    axios
      .put(`http://localhost:3001/api/todos/${id}`)
      .then((res) =>
        setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)))
      );
  };

  return (
    <div className="TodoWrapper">
      <h1>Užduočių sąrašas</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) => (
        <Todo
          key={todo._id}
          todo={todo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  );
};
