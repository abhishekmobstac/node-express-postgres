const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'abhishek',
  host: 'localhost',
  port: 5432,
  database: 'nodelogin',
});

module.exports = pool;
