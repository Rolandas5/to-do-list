const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/todoController');

router.get('/', ctrl.getTodos);
router.post('/', ctrl.createTodo);
router.put('/:id', ctrl.toggleTodo);
router.put('/:id/edit', ctrl.updateTodo);
router.delete('/:id', ctrl.deleteTodo);

module.exports = router;
