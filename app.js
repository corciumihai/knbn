const express = require('express');
const app = express();
const reactEngine = require('react-view-engine');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('./database/database');
const backupDatabase = require('./database/BackupDatabase');
const bcrypt = require('bcrypt-nodejs');

app.use(express.static('public'));
app.set('port', process.env.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());

router.get('/login', function(request, response){
    response.render(path.resolve(__dirname, 'views', 'login.pug'));
});

router.get('/estimation-help', function(request, response){
    response.render(path.resolve(__dirname, 'views', 'estimation-help.pug'));
})

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
                // console.log('Haha');
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

router.post('/register', (request, response) => {
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
    var query = database.query('SELECT * FROM cards WHERE laneID = ?', request.params.laneID, function(error, result, fields){
        if(error){
            console.log('Database error: ' + error);
            return;
        }
        // console.log(result);
        response.send(result);
    });

});

router.post('/cards/modify', (request, response) => {
    let query = database.query('UPDATE cards SET laneID = ? where ID = ?', [request.body.lane, request.body.id], (error, result, fields) => {
        if(error){
            console.log('Database error: ' + error);
            return;
        }
    });
    //send a response
    // console.log(request.body);
});

router.get('/count', (request, response) => {
    let query = database.query('SELECT COUNT(*) AS count FROM cards', (error, result, fields) => {
        if(error){
            console.log('Databse error at users: ' + error);
            return;
        }
        response.send(result);
    });
});

router.get('/users/get-users', function(request, response){
    // console.log('hit this');
    var query = database.query('SELECT email, name from users', timeout = 5000, (error, result, fields) => {
        if(error){
            console.log('Databse error at users: ' + error);
            return;
        }
        response.send(result);
    })
});

router.post('/create/card', (request, response) => {
    let incomingData = request.body;

    let query = database.query('INSERT INTO cards SET ?', {
        id: incomingData.ticketId, 
        name: incomingData.ticketName,
        reporter: incomingData.reporter.name,
        assignee: incomingData.assignee.name,
        project: incomingData.project.name,
        startDate: incomingData.startDate,
        endDate: incomingData.endDate,
        description: incomingData.description,
        laneID: "backlog"
    }, (error, result, fields) => {
        if(error){
            console.log('Database error at cards: ' + error);
            return;
        }
        //send positive response
    })

});

router.get('/get-projects', (request, response) => {
    let query = database.query('SELECT * FROM projects', (error, result, fields) => {
        if(error){
            console.log('Database error at projects: ' + error);
            return;
        }
        response.send(result);
    });
});

router.post('/create-project', (request, response) => {
    let incomingData = request.body;
    console.log(incomingData);
    let query = database.query('INSERT INTO projects SET ?', {
        id: incomingData.id,
        name: incomingData.name
    }, (error, result, fields) => {
        if(error){
            console.log('Database error at projects: ' + error);
            return;
        }
        //send positive response
    });
});

router.get('/count-projects', (request, response) => {
    let query = database.query('SELECT COUNT(*) as count FROM projects', (error, result, fields) => {
        if(error){
            console.log('Database error at projects: ' + error);
            return;
        }
        
        response.send(result);
    })
});

router.get('/count-components', (request, response) => {
    let query = database.query('SELECT COUNT(*) AS count FROM components', (error, result, fields) => {
        if(error){
            console.log('Database error at components: ' + error);
            return;
        }
        response.send(result);
    })
});

router.post('/create-component', (request, response) => {
    let incomingData = request.body;
    let query = database.query('INSERT INTO components SET ?', {
        id: incomingData.id,
        name: incomingData.name,
        project: incomingData.project.id,
    }, (error, result, fields) => {
        if(error){
            console.log('Database error at components: ' + error);
            return;
        }
        //send positive response
    });
});

router.get('/components', (request, response) => {
    let incomingData = request.body;
    if(!incomingData.length){
        let query = database.query('SELECT * FROM components', (error, result, fields) => {
            if(error){
                console.log('Database error at components: ' + error);
                return;
            }
            response.send(result);
        });
    }
});

router.post('/components', (request, response) => {
    let incomingData = request.body;
    let query = database.query('SELECT * FROM components WHERE project = ?', incomingData.id, (error, result, fields) => {
        if(error){
            console.log('Database error at components: ' + error);
            return;
        }
        response.send(result);
    });
});

// --------------------------------------------------------------------------

router.get('/create-project', (request, response) => {
    response.render(path.resolve(__dirname, 'views', 'create_project.pug'))
});

app.use(express.static(__dirname + '/routes'));
app.use(router);

app.listen(app.get('port'), function(){
    console.log('App is listening to port ' + app.get('port'));
});

