const Todo = require('../models/todoModel');

// Gauti visas prisijungusio vartotojo užduotis
exports.getTodos = async (req, res) => {
  try {
    const userId = req.user.id; // Ištraukiam prisijungusio vartotojo ID
    const todos = await Todo.find({ userId }); // Gaunam tik jo užduotis
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Klaida gaunant užduotis' });
  }
};

// Sukurti naują užduotį
exports.createTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    console.log('Gauti duomenys:', title, description, status);
    console.log('Vartotojas (req.user):', req.user);

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Vartotojas nerastas' });
    }

    const todo = await new Todo({
      title,
      description,
      status: status || 'nebaigta',
      userId: req.user.id,
    }).save();

    res.status(201).json(todo);
  } catch (error) {
    console.error('Serverio klaida kuriant užduotį:', error);
    res
      .status(500)
      .json({ message: 'Klaida kuriant užduotį', error: error.message });
  }
};

// Perjungti užduoties statusą (nebaigta/baigta)
exports.toggleTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todo = await Todo.findOne({ _id: req.params.id, userId }); // Pažiūrim ar užduotis tikrai to vartotojo

    if (!todo) return res.status(404).json({ message: 'Užduotis nerasta' });

    todo.status = todo.status === 'baigta' ? 'nebaigta' : 'baigta';
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Klaida keičiant užduotį' });
  }
};

// Atnaujinti užduotį
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const todo = await Todo.findOne({ _id: req.params.id, userId });

    if (!todo) return res.status(404).json({ message: 'Užduotis nerasta' });

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (status) todo.status = status;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Klaida atnaujinant užduotį' });
  }
};

// Ištrinti užduotį
exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId });

    if (!todo) return res.status(404).json({ message: 'Užduotis nerasta' });

    res.json({ message: 'Užduotis ištrinta' });
  } catch (error) {
    res.status(500).json({ message: 'Klaida trinant užduotį' });
  }
};
