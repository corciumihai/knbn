const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'knbn-secure-db'
  });

connection.connect(function(error){
    if(error){
        console.log('Unable to connect to database, error ' + error);
        return;
    }
    console.log('Database connected');
});

module.exports = connection;