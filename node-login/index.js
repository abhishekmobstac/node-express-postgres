const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// middlewares
app.use(cors());
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: false })); // req.query
// templating engine
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/users/dashboard', (req, res) => {
//   res.render('dashboard', { user: 'Abhishek' });
// });

// login the user
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.rowCount > 0) {
        if (results.rows[0].password === password) {
          res.json({
            message: 'Login successful',
            user: results.rows[0],
          });
        } else {
          res.json({
            message: 'Incorrect password',
          });
        }
      } else {
        res.json({
          message: 'User not found',
        });
      }
    }
  );
});

// register the user
app.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  // res.render('register');

  if (!name || !email || !password) {
    res.json({ message: 'Please enter all the fields' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.rows[0] == undefined) {
      pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password],
        (err, result) => {
          if (err) {
            throw err;
          }
          console.log('User Successfully Registered!', result.rows[0]);
          res.json({ message: 'User Successfully Registered!' });
        }
      );
    } else {
      console.log('User already exists!');
      res.json({ message: 'User Already Exist' });
    }
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
