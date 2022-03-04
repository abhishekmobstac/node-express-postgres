const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// middlewares
app.use(cors());
app.use(express.json()); // req.body

// ROUTES

// create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description, status } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description, status) VALUES($1, $2) RETURNING *',
      [description, status]
    );

    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// get all the todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo');
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// get a todo

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE id = $1', [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;
    const updateTodo = await pool.query(
      'UPDATE todo SET description = $1, status = $2 WHERE id = $3 RETURNING *',
      [description, status, id]
    );
    res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query('DELETE FROM todo WHERE id = $1', [id]);
    res.json('Todo deleted');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
