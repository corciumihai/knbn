const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "mihaicorciu",
    password: "Knbn-secure-db-7*",
    database: 'knbn',
  });

connection.connect(function(error){
    if(error){
        console.log('Unable to connect to database, error ' + error);
        return;
    }
    console.log('Database connected');
});

module.exports = connection;
