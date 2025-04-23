const express = require('express');
const router = express.Router();
const Todo = require('./models/Todo');

// Gauti visus todo
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Sukurti naują todo
router.post('/', async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

// Pažymėti kaip atliktą / neatliktą
router.put('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Ištrinti todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ištrinta' });
});

module.exports = router;

// Ištrinti todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ištrinta' });
});

module.exports = router;
