const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'backup'
  });

connection.connect(function(error){
    if(error){
        console.log('Unable to connect to backup database');
        return;
    }
    console.log('Backup database connected');
});

module.exports = connection;