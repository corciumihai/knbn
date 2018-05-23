const express = require('express');
const app = express();
const reactEngine = require('react-view-engine');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('./database/database');
const bcrypt = require('bcrypt-nodejs');
const mysql = require('mysql');

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
    var query = database.query('SELECT email as \'key\', name as \'value\' from users', (error, result, fields) => {
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
    let query = database.query('SELECT name as \'value\', id as \'key\' FROM projects', (error, result, fields) => {
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
    response.render(path.resolve(__dirname, 'views', 'create_project.pug'));
});

router.get('/create', (request, response) => {
    response.render(path.resolve(__dirname, 'views', 'create.pug'));
});

/* *******************************************< add project >*********************************************************** */
router.post('/add/project', (request, response) => {
    let data = request.body;
    // prepare to ackownledge existence of component
    database.query('SELECT count(*) AS count FROM projects WHERE name = ?', data.projectName, (error, result, fields) => {
        if(error){
            // table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                // create projects table
                database.query('CREATE TABLE projects (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, shortName VARCHAR(255), name VARCHAR(255)NOT NULL, \
                startDate VARCHAR(255), endDate VARCHAR(255))', (error, result, fields) => {
                    if(error){
                        console.log('Error creating table \'projects\' for the first time: ' + error.code);
                        return;
                    }
                });
                //insert immediately into table project data
                database.query('INSERT INTO projects SET ?', {name: data.projectName, shortName: data.shortName, startDate: data.startDate, endDate: data.endDate}, (error, result, fields) => {
                    if(error){
                        console.log('Error when inserting data in \'projects\' table: ' + error.code);
                        return;
                    }
                });
                response.statusCode = 200;
                response.send({ success: 'Project successfully added to database!' });
                console.log('Project successfully added to database!');
                return;
            }
            console.log('Database error when checking existence of project: ' + error.code);
            return;
        }
        if(result[0].count > 0){
            //send back negative response
            response.statusCode = 400;
            response.send({error: 'Project name already exists in the database'});
            return;
        }
        //insert project data in the database
        database.query('INSERT INTO projects SET ?', {name: data.projectName, shortName: data.shortName, startDate: data.startDate, endDate: data.endDate}, (error, result, fields) => {
            if(error){
                console.log('Error when inserting data in \'projects\' table: ' + error.code);
                return;
            }
        });
        response.statusCode = 200;
        response.send({ success: 'Project successfully added to database!' });
        console.log('Project successfully added to database!');
    });

    // insert disciplines into table
    let disciplines = data.disciplines;
    let all = [];
    disciplines.forEach(discipline => {
        all.push([discipline, data.shortName]);
    });
    console.log(all);
    database.query('INSERT INTO disciplines(name, project) VALUES ?', [all], (error, result, fields) => {
        if(error){
            if(error.code == 'ER_NO_SUCH_TABLE'){
                database.query('CREATE TABLE disciplines (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, project VARCHAR(255)NOT NULL, name VARCHAR(255)NOT NULL)', (error, result, fields) => {
                    if(error){
                        console.log('Error creating table \'disciplines\' for the first time: ' + error.code);
                        return;
                    }
                    console.log('Table disciplines created');
                    console.log(all);
                    database.query('INSERT INTO disciplines(name, project) VALUES ?', [all], (error, result, fields) => {
                        if(error){
                            console.log('Error when inserting values for the first time in \'disciplines\': ' + error.code);
                            return;
                        }
                    });
                    console.log('Values inserted in table disciplines');
                });
                return;
            }
            console.log('Error when inserting values in table disciplines: ' + error.code);
            return;
        }
        console.log('Values inserted into table disciplies');
    });

    // insert releases into table
    let releases = data.releases;
    values = [];
    releases.forEach(release => {
        values.push([release.name, data.shortName, release.startDate, release.endDate]);
    });
    console.log(values);
    database.query('INSERT INTO releases(name, project, startDate, endDate) VALUES ?', [values], (error, result, fields) => {
        if(error){
            if(error.code == 'ER_NO_SUCH_TABLE'){
                database.query('CREATE TABLE releases (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, name VARCHAR(255)NOT NULL, project VARCHAR(255)NOT NULL, \
                        startDate VARCHAR(255)NOT NULL, endDate VARCHAR(255)NOT NULL)', (error, result, fields) => {
                    if(error){
                        console.log('Error creating table \'releases\' for the first time: ' + error.code);
                        return;
                    }
                    console.log('Table releases created');

                    database.query('INSERT INTO releases(name, project, startDate, endDate) VALUES ?', [values], (error, result, fields) => {
                        if(error){
                            console.log('Error when inserting values for the first time in \'releases\': ' + error.code);
                            return;
                        }
                    });
                    console.log('Values inserted in table releases');
                });
                return;
            }
            console.log('Error when inserting values in table releases: ' + error.code);
            return;
        }
        console.log('Values inserted into table releases');
    });

    // send error that there are some releases in the table already
});
//********************************************************************************************************************** */

/* *******************************************[ add component ]********************************************************* */
router.post('/add/component', (request, response) => {
    let data = request.body;
    console.log(data);
    // prepare to ackownledge existence of component
    database.query('select count(*) as count from components where name = ?', data.name, (error, result, fields) => {
        if(error){
            //table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                //create table
                database.query('CREATE TABLE components (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, project INT, name VARCHAR(255)NOT NULL, \
                description VARCHAR(2000), dueDate VARCHAR(255), startDate VARCHAR(255), rel INT, discipline INT)', (error, result, fields) => {
                    if(error){
                        console.log('Error when creating table \'components\' for the first time: ' + error.code);
                        return;
                    }
                    //insert into table
                    database.query('insert into components set ?', data, (error, result, fields) => {
                        if(error){
                            console.log('Database error when inserting component in database: ' + error);
                            return;
                        }
                        //send back positive response
                        response.statusCode = 200;
                        response.send({ success: 'Component successfully added to database!' });
                        console.log('Component successfully added to database!');
                        return;
                    });
                });
            }
            console.log('Database error when checking existence of component: ' + error.code);
            return;
        }
        //check component duplicate component name - TBD: also duplicate component id
        if(result[0].count > 0){
            //send back negative response
            response.statusCode = 400;
            response.send({error: 'Component name already exists in the database'});
            return;
        }
        //insert into database 
        database.query('insert into components set ?', data, (error, result, fields) => {
            if(error){
                console.log('Database error when inserting component in database: ' + error);
                return;
            }
            //send back positive response
            response.statusCode = 200;
            response.send({ success: 'Component successfully added to database!' });
            console.log('Component successfully added to database!');
        });
    });
});
//********************************************************************************************************************** */

/* *******************************************[ add ticket ]************************************************************ */
router.post('/add/ticket', (request, response) => {
    let data = request.body;
    console.log(data);
    data.lane = 0;
    // prepare to ackownledge existence of ticket
    //change name to id - somehow generate id based on project name
    database.query('SELECT COUNT(*) AS count FROM tickets', (error, result, fields) => {
        if(error){
            //table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                //create table
                //TODO: generate id based on ticket number since autoincrement is not viable
                //TODO: verify which is more viable: INT or VARCHAR
                database.query('CREATE TABLE tickets (id INT PRIMARY KEY UNIQUE, component INT, \
                    name VARCHAR(255)NOT NULL, description VARCHAR(2000), dueDate VARCHAR(255)NOT NULL, startDate VARCHAR(255)NOT NULL, discipline INT, \
                    reporter VARCHAR(255)NOT NULL, assignee VARCHAR(255)NOT NULL, blocked INT, blocking INT, estimation INT, lane INT, priority INT)', (error, result, fields) => {
                    if(error){
                        console.log('Error when creating table \'tickets\' for the first time: ' + error.code);
                        return;
                    }
                    //insert into table
                    data.id = 1;
                    database.query('INSERT INTO tickets SET ?', data, (error, result, fields) => {
                        if(error){
                            console.log('Database error when inserting ticket in database: ' + error);
                            return;
                        }
                        //send back positive response
                        response.statusCode = 200;
                        response.send({ success: 'Ticket successfully added to database!' });
                        console.log('Ticket successfully added to database!');
                        return;
                    });
                });
            }
            console.log('Database error when checking existence of ticket: ' + error.code);
            return;
        }
        data.id = result[0].count + 1;
        //insert into database 
        database.query('insert into tickets set ?', data, (error, result, fields) => {
            if(error){
                console.log('Database error when inserting ticket in database: ' + error);
                return;
            }
            //send back positive response
            response.statusCode = 200;
            response.send({ success: 'Ticket successfully added to database!' });
            console.log('Ticket successfully added to database!');
        });
    });
});
//********************************************************************************************************************** */

/* *******************************************[ add problem report ]**************************************************** */
router.post('/add/report', (request, response) => {
    let data = request.body;
    console.log(data);
    data.lane = 0;
    // prepare to ackownledge existence
    database.query('SELECT COUNT(*) AS count FROM reports', (error, result, fields) => {
        if(error){
            //table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                //create table
                database.query('CREATE TABLE reports (id INT UNIQUE PRIMARY KEY, component INT, \
                    name VARCHAR(255)NOT NULL, description VARCHAR(2000), dueDate VARCHAR(255)NOT NULL, startDate VARCHAR(255)NOT NULL, discipline INT, \
                    reporter VARCHAR(255)NOT NULL, assignee VARCHAR(255)NOT NULL, blocked INT, blocking INT, estimation INT, steps VARCHAR(255), \
                    observedBehaviour VARCHAR(255), expectedBehaviour VARCHAR(255), priority INT, lane INT)', (error, result, fields) => {
                    if(error){
                        console.log('Error when creating table \'reports\' for the first time: ' + error.code);
                        return;
                    }
                    //insert into table
                    data.id = 1;
                    database.query('INSERT INTO reports SET ?', data, (error, result, fields) => {
                        if(error){
                            console.log('Database error when inserting problem report in database: ' + error);
                            return;
                        }
                        //send back positive response
                        response.statusCode = 200;
                        response.send({ success: 'Problem report successfully added to database!' });
                        console.log('Problem report successfully added to database!');
                        return;
                    });
                });
                return;
            }
            console.log('Database error when checking existence of report: ' + error.code);
            return;
        }
        // //insert into database 
        data.lane = 0;
        data.id = result[0].count + 1;
        database.query('INSERT INTO reports SET ?', data, (error, result, fields) => {
            if(error){
                console.log('Database error when inserting problem report in database: ' + error);
                return;
            }
            //send back positive response
            response.statusCode = 200;
            response.send({ success: 'Problem report successfully added to database!' });
            console.log('Problem reports successfully added to database!');
        });
    });
});
//********************************************************************************************************************** */

/* *************************************************[ get releases ]**************************************************** */
router.get('/get-releases', (request, response) => {
    database.query('SELECT id AS \'key\', name AS \'value\' FROM releases', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});
/* ********************************************************************************************************************* */

/* *************************************************[ get disciplines ]************************************************* */
router.get('/get-disciplines', (request, response) => {
    database.query('SELECT id AS \'key\', name AS \'value\' FROM disciplines', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});
/* ********************************************************************************************************************* */

/* *************************************************[ get labels ]****************************************************** */
router.get('/get-components', (request, response) => {
    database.query('SELECT id AS \'key\', name AS \'value\' FROM components', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});
/* ********************************************************************************************************************* */

/* *************************************************[ get tickets ]***************************************************** */
router.get('/get-tickets', (request, response) => {
    database.query('SELECT id AS \'key\', name AS \'value\' FROM tickets', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});
/* ********************************************************************************************************************* */

/* *************************************************[ get tickets dash ]************************************************ */
router.get('/get-tickets-dash', (request, response) => {
    database.query('SELECT * from tickets where tickets.lane = ? and tickets.component = ?', 
    [request.query.lane, request.query.component], (error, result, fields) => {
        if(error){
            console.log('Database error when fetching dashboard: ' + error.code);
            return;
        }
        // tickets = result;
        response.send(result);
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ change ticket lane ]********************************************** */
router.post('/change-lane', (request, response) => {
    let data = request.body;
    database.query("UPDATE tickets SET lane = ? WHERE id = ?", [data.lane, data.id], (error, result, fields) => {
        if(error){
            console.log('Database error when updating lanes: ' + error.code);
            response.statusCode = 400;
            response.send({success: 0});
            return;
        }
        response.statusCode = 200;
        response.send({success: 0});
        console.log('Ticket lane successfully updated in database');
    });
    
});
/* ********************************************************************************************************************* */

/* *************************************************[ get components ]************************************************** */
router.get('/components', (request, response) => {
    database.query('SELECT * FROM components', (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at components: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send(result);
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ change ticket lane ]********************************************** */
router.get('/conv-user', (request, response) => {
    let params = request.query;
    database.query('SELECT name, email FROM users where email = ?', request.query.user, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at components: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send(result[0]);
    });
});
/* ********************************************************************************************************************* */



app.use(express.static(__dirname + '/routes'));
app.use(router);

app.listen(app.get('port'), function(){
    console.log('App is listening to port ' + app.get('port'));
});
