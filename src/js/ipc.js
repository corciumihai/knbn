const ipcMain = require('electron').ipcMain;
const request = require('request');

function userSignup() {
    //get the data from renderer when there is sent
    ipcMain.on('user-signup', function(event, argument){
    
    var options = {
        uri: "http://localhost:8080/signup",
        method: "POST",
        body: argument,
        json: true,
    }
  
    //send a request to the server to verify the user using the API
    request(options, function(error, response, body){
        if (error){
            console.log('Error occured ' + error);
        }

        if(response.statusCode === 202){
            console.log('User already in the database');
        }
        else if(response.statusCode === 201){
            console.log('User was created!');
        }
        else if(response.statusCode == 404){
            console.log('Error occured ' + body);
        }
    });
  });
}

module.exports = {
    userSignup: userSignup(),
}