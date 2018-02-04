const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'knbn_database'
  });

connection.connect(function(error){
    if(error){
        console.log('Unable to connect to database, error ' + error);
    }
    console.log('Database connected');
});

module.exports = connection;