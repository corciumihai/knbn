const express = require('express');
const app = express();
const reactEngine = require('react-view-engine');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('./database/database');
const bcrypt = require('bcrypt-nodejs');

app.use(express.static('public'));
app.set('port', process.env.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
router.get('/login', function(request, response){
    response.render(path.resolve(__dirname, 'views', 'login.pug'));
});

router.post('/login', function(request, response){
    // verify against database and send back response
    var userData = {};
    userData.email = request.body.email;
    userData.password = request.body.password;
    userData.rememberPassword = request.body.rememberPassword;

    // check if in the database and re-route
    var query = database.query('SELECT * FROM users WHERE email = ?', [userData.email], function(error, result){
        if(error){
            console.log('Error ', error);
        }
        if(result.length){
            // check if the password is correct
            if(userData.password === result[0].password){
                // redirect to the dashboard
                // TODO this piece of code does not redirect correctly
                response.redirect('/dashboard');
                console.log('Haha');
            }
        }
        else{
            // do something when there is are no results
            // invalid email status code
            response.statusCode = 405;
            response.send('');
        }
    });
});

router.get('/register', function(request, response){
    response.render(path.resolve(__dirname, 'views', 'register.pug'));
})

router.post('/register', function(request, response){
    // add user to database and send back response
    // TODO use a class where you can hash the password on creation of the object
    var userData = {
        email: request.body.email, 
        // TODO hash the password
        password: request.body.password, 
        company: request.body.company
    };
    // TODO escape more values
    // TODO read more about the mysql nodejs module
    var query = database.query('INSERT INTO users SET ?', userData, function(error, result, fields){
        if(error){
            switch(error.code){
                case 'ER_DUP_ENTRY':
                    response.send({email: 'Email already exists'});
                break;
                // TODO add more error codes
            }
            return; // do not continue the execution if error occures
        }
        response.redirect('/login'); // redirect to the login page
    });
});

router.get('/dashboard', function(request, response){
    response.render(path.resolve(__dirname, 'views', 'dashboard.pug'));
});

router.get('/cards/:laneID', function(request, response){
    var query = database.query('SELECT * from cards where laneID = ?', request.params.laneID, function(error, result, fields){
        if(error){
            console.log('Database error: ' + error);
            return;
        }
        response.send(result);
    });

});

router.get('/users/get-users', function(request, response){
    console.log('hit this');
    var query = database.query('SELECT email, name from users', (error, result, fields) => {
        if(error){
            console.log('Databse error at users: ' + error);
            return;
        }
        response.send(result);
    })
})

app.use(express.static(__dirname + '/routes'));
app.use(router);

app.listen(app.get('port'), function(){
    console.log('App is listening to port ' + app.get('port'));
});

