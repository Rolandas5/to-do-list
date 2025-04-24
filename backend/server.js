const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const todosRoutes = require('./routes/todosRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/todos', todosRoutes);
app.use('/api/auth', authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Prisijungta prie MongoDB');
    app.listen(PORT, () => {
      console.log(`Serveris veikia: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Klaida jungiantis prie DB:', err);
  });
