var mysql      = require('mysql');
var database = mysql.createConnection({
  host     : 'localhost',
  port     : '3308',
  user     : 'root',
  password : '',
  database : 'hifampitantsoa'
});
database.connect()

module.exports = database