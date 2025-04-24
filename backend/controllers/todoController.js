const Todo = require('../models/todoModel');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
};

exports.toggleTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ištrinta' });
};

exports.updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.text = req.body.text;
  await todo.save();
  res.json(todo);
};
