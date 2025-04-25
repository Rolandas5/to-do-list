const Todo = require('../models/todoModel');

// Gauti visas užduotis
exports.getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

// Sukurti naują užduotį
exports.createTodo = async (req, res) => {
  const { title, description, status } = req.body;

  const todo = new Todo({
    title,
    description,
    status: status || 'nebaigta',
  });

  await todo.save();
  res.json(todo);
};

// Perjungti statusą (baigta <-> nebaigta)
exports.toggleTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo nerastas' });

  todo.status = todo.status === 'baigta' ? 'nebaigta' : 'baigta';
  await todo.save();
  res.json(todo);
};

// Atnaujinti pavadinimą, aprašymą, statusą
exports.updateTodo = async (req, res) => {
  const { title, description, status } = req.body;

  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo nerastas' });

  if (title) todo.title = title;
  if (description) todo.description = description;
  if (status) todo.status = status;

  await todo.save();
  res.json(todo);
};

// Ištrinti užduotį
exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Užduotis ištrinta' });
};
