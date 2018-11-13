const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('./database/database');
const https = require('https');
const fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserSchema = require('./public/components/login/UserSchema');
const bcrypt = require('bcryptjs');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie: { maxAge: 600000}}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    UserSchema.findUser(email, (error, user) => {
        return done(null, user);
    });
});

passport.use(new LocalStrategy((email, password, done) => {
    console.log(email, password);
    UserSchema.findUser(email, (error, user) => {
        if(error){ 
            return done(error); 
        }
        if(!user){
            return done(null, false, { message: 'Incorrect username' });
        }
        if(!UserSchema.validate(password, user.password)){
            console.log('Incorrect password');
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    });
}));

router.post('/user/checkuser', (request, response) => {
    let data = request.body;
    var query = database.query('SELECT * FROM users WHERE email = ?', [data.email], function(error, result, fields){
        if(error){response.send({success:false, message: 'Unexpected error occured'}); console.log(error); return;}
        if(result != undefined && result.length > 0){  
            response.send({success: false, message: 'Email already exists in our database'});
            return;
        }
        response.send({success: true});
    });
});

router.get('/register', function(request, response){response.render(path.resolve(__dirname, 'views', 'register.pug'));});
router.post('/register', (request, response) => {
    let data = request.body;
    data.password = bcrypt.hashSync(data.password, 8);
    var query = database.query('INSERT INTO users SET ?', data, function(error, result, fields){
        if(error){
            response.redirect('/register'); 
            return;
        }
        response.redirect('/login');
    });
});

router.get('/login', function(request, response){response.render(path.resolve(__dirname, 'views', 'login.pug'));});
router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));




router.get('/view/ticket/:id', (request, response) => {response.render(path.resolve(__dirname, 'views', 'view.pug')); });
router.get('/view/report/:id', (request, response) => {response.render(path.resolve(__dirname, 'views', 'view.pug')); });
router.get('/view/project/:id', (request, response) => {response.render(path.resolve(__dirname, 'views', 'view.pug')); });



router.get('/', function(request, response){
    if(request.isAuthenticated()){response.render(path.resolve(__dirname, 'views', 'dashboard.pug'));}
    else{response.redirect('/login');}
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
                description VARCHAR(2000), dueDate VARCHAR(255), startDate VARCHAR(255), rel INT, discipline INT, wip INT)', (error, result, fields) => {
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
                    reporter VARCHAR(255)NOT NULL, assignee VARCHAR(255)NOT NULL, blocked INT UNSIGNED, blocking INT UNSIGNED, estimation INT UNSIGNED NOT NULL, logged INT UNSIGNED NOT NULL, lane INT UNSIGNED NOT NULL, \
                    priority INT UNSIGNED, steps VARCHAR(1000), observedBehaviour VARCHAR(1000), expectedBehaviour VARCHAR(1000),\
                    rel INT UNSIGNED, isReport BOOL NOT NULL,\
                    lastModified BIGINT UNSIGNED NOT NULL, created BIGINT UNSIGNED NOT NULL)', (error, result, fields) => {
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
                    });
                });
                return;
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

/* *******************************************[ add comment ]*********************************************************** */
router.post('/add/comment', (request, response) => {
    let data = request.body;
    console.log(data);
    delete data.id;
    // prepare to ackownledge existence
    database.query('INSERT INTO comments SET ?', data, (error, result, fields) => {
        if(error){
            //table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                //create table
                database.query('CREATE TABLE comments (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, val VARCHAR(1000) NOT NULL,\
                    ticketId INT NOT NULL, author INT NOT NULL, created BIGINT NOT NULL, lastModified BIGINT NOT NULL) AUTO_INCREMENT = 0;', (error, result, fields) => {
                    if(error){
                        console.log('Error when creating table \'comments\' for the first time: ' + error.code);
                        return;
                    }
                    //insert into table
                    database.query('INSERT INTO comments SET ?', data, (error, result, fields) => {
                        if(error){
                            console.log('Database error when inserting comment in database: ' + error.code);
                            return;
                        }
                        //send back positive response
                        response.statusCode = 200;
                        response.send({ success: 'Comment successfully added to database!' });
                        console.log('Comment successfully added to database!');
                        return;
                    });
                });
                return;
            }
            console.log('Database error when checking existence of comment: ' + error.code);
        }
        response.statusCode = 200;
        response.send({ success: 'Comment successfully added to database!' });
        console.log('Comment successfully added to database!');
        return;
    });
});
//********************************************************************************************************************** */

/* *******************************************[ add worklog ]*********************************************************** */
router.post('/add/worklog', (request, response) => {
    let data = request.body;
    delete data.id;
    // prepare to ackownledge existence
    database.query('INSERT INTO worklogs SET ?', data, (error, result, fields) => {
        if(error){
            //table does not exist
            if(error.code == 'ER_NO_SUCH_TABLE'){
                //create table
                database.query('CREATE TABLE worklogs (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, val VARCHAR(1000) NOT NULL,\
                    ticketId INT NOT NULL, author INT NOT NULL, created BIGINT NOT NULL, lastModified BIGINT NOT NULL, hours INT NOT NULL) AUTO_INCREMENT = 0;', (error, result, fields) => {
                    if(error){
                        console.log('Error when creating table \'worklogs\' for the first time: ' + error.code);
                        return;
                    }
                    //insert into table
                    database.query('INSERT INTO worklogs SET ?', data, (error, result, fields) => {
                        if(error){
                            console.log('Database error when inserting worklog in database: ' + error.code);
                            return;
                        }
                        //send back positive response
                        database.query('UPDATE tickets SET logged = logged + ? WHERE id = ?', [data.hours, data.ticketId], (error, result, fields) => {
                            if(error){
                                console.log('Error when logging hours in ticket ' + error.code);
                                return;
                            }
                            response.statusCode = 200;
                            response.send({ success: 'Worklog successfully added to database!' });
                            console.log('Worklog successfully added to database!');
                            return;
                        }); 
                        return;
                    });
                });
                return;
            }
            console.log('Database error when checking existence of worklog: ' + error.code);

        }

        database.query('UPDATE tickets SET logged = logged + ? WHERE id = ?', [data.hours, data.ticketId], (error, result, fields) => {
            if(error){
                console.log('Error when logging hours in ticket ' + error.code);
                return;
            }
            response.statusCode = 200;
            response.send({ success: 'Worklog successfully added to database!' });
            console.log('Worklog successfully added to database!');
            return;
        }); 
        return;
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

/* *************************************************[ get ticket ]****************************************************** */
router.get('/get-ticket/:id', (request, response) => {    
    database.query('SELECT * FROM tickets WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            console.log('Database error when fetching single ticket: ' + error.code);
            return;
        }

        let ticket = result[0];
        database.query('SELECT id, name, project FROM components WHERE id = ?', ticket.component, (error, result, fields) => {
            if(error){console.log("1 " + error.code); return; }
            let component = result[0];

            database.query('SELECT id, shortName, name FROM projects WHERE id = ?', component.project, (error, result, fields) => {
                if(error){console.log("2 " + error.code); return; }
                let project = result[0];
                // console.log(project);

                database.query('SELECT id, name FROM disciplines WHERE id = ?', ticket.discipline, (error, result, fields) => {
                    if(error){console.log("3 " + error.code); return; }
                    let discipline = result[0];

                    database.query('SELECT id, name FROM releases WHERE id = ?', ticket.rel, (error, result, fields) => {
                        if(error){console.log("4 " + error.code); return; }
                        let rel = result[0];
    
                        database.query('SELECT email, name from users where email = ?', ticket.reporter, (error, result, fields) => {
                            if(error){console.log("5 " + error.code); return; }
                            let reporter = result[0];

                            database.query('SELECT email, name from users where email = ?', ticket.assignee, (error, result, fields) => {
                                if(error){console.log("6 " + error.code); return; }
                                let assignee = result[0];

                                database.query('SELECT name as \'key\', name as \'value\' FROM tickets WHERE id = ?', ticket.blocking, (error, result, fields) => {
                                    if(error){console.log("7 " + error.code); return;}
                                    let blocking = result[0];

                                    database.query('SELECT name as \'key\', name as \'value\' FROM tickets WHERE id = ?', ticket.blocked, (error, result, fields) => {
                                        if(error){console.log("8 " + error.code); return;}
                                        let blocked = result[0];
                                        
                                        response.send({ticket: ticket, project: project, release: rel, component: component, discipline: discipline, reporter: reporter, assignee: assignee,
                                            blocking: blocking, blocked: blocked});
                                    })
                                });
                            });
                        });
                    });
                })
            });
        });

        // response.send({ticket: ticket});
        // console.log(project);
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ get tickets dash ]************************************************ */
router.get('/get-tickets-dash', (request, response) => {
    database.query('SELECT * from tickets where component = ?', [request.query.component], (error, result, fields) => {
        if(error){
            console.log('Database error when fetching dashboard: ' + error.code);
            return;
        }
        tickets = result;

        database.query('SELECT project from components where id = ?', [request.query.component], (error, result, fields) => {
            if(error){
                console.log('Database error when fetching dashboard: ' + error.code);
                return;
            }
            proj = result[0];

            database.query('SELECT shortName from projects where id = ?', [proj.project], (error, result, fields) => {
                if(error){
                    console.log('Database error when fetching dashboard: ' + error.code);
                    return;
                }

                response.send({tickets: tickets, shortName: result[0]});
            });

        });
        // 
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

/* *************************************************[ get comments ]************************************************** */
router.get('/get/comments/:id', (request, response) => {
    database.query('SELECT * FROM comments WHERE ticketId = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at comments: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send(result);
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ get worklogs ]**************************************************** */
router.get('/get/worklogs/:id', (request, response) => {
    database.query('SELECT * FROM worklogs WHERE ticketId = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at worklogs: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send(result);
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ change ticket lane ]********************************************** */
router.post('/conv-user', (request, response) => {
    console.log(request.body.user);
    database.query('SELECT * FROM users WHERE email = ?', request.body.user, (error, result, fields) => {
        if(error){
            console.log('Database error at tick: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send(result[0]);
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket name ]********************************************** */
router.post('/update/ticket/name', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET name = ? WHERE id = ?', [data.name, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at components: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket name ]********************************************** */
router.post('/update/ticket/lane', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET lane = ?, lastModified = ? WHERE id = ?', [data.lane, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at components: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket reporter ]********************************************** */
router.post('/update/ticket/reporter', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET reporter = ? WHERE id = ?', [data.user, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket reporter: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket assignee ]********************************************** */
router.post('/update/ticket/assignee', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET assignee = ? WHERE id = ?', [data.user, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket assignee: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket start date ]********************************************** */
router.post('/update/ticket/startDate', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET startDate = ? WHERE id = ?', [data.date, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket assignee: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket due date ]********************************************** */
router.post('/update/ticket/dueDate', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET dueDate = ? WHERE id = ?', [data.date, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket assignee: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket estimation ]**************************************** */
router.post('/update/ticket/estimation', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET estimation = ?, lastModified = ? WHERE id = ?', [data.hours, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            // response.send({success: 0});
            console.log('Database error at components: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket discipline ]**************************************** */
router.post('/update/ticket/discipline', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET discipline = ?, lastModified = ? WHERE id = ?', [data.id, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            // response.send({success: 0});
            console.log('Database error at ticket discipline: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket discipline ]**************************************** */
router.post('/update/ticket/prio', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET priority = ?, lastModified = ? WHERE id = ?', [data.id, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            // response.send({success: 0});
            console.log('Database error at ticket discipline: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket release ]**************************************** */
router.post('/update/ticket/release', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET rel = ?, lastModified = ? WHERE id = ?', [data.id, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            // response.send({success: 0});
            console.log('Database error at ticket discipline: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket blocking ]**************************************** */
router.post('/update/ticket/blocking', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET blocking = ?, lastModified = ? WHERE id = ?', [data.id, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket blocking: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket blocked ]**************************************** */
router.post('/update/ticket/blocked', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('UPDATE tickets SET blocked = ?, lastModified = ? WHERE id = ?', [data.id, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket blocked: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket steps ]**************************************** */
router.post('/update/ticket/steps', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET steps = ?, lastModified = ? WHERE id = ?', [data.steps, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket blocked: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket observed behaviour ]**************************************** */
router.post('/update/ticket/observed', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET observedBehaviour = ?, lastModified = ? WHERE id = ?', [data.observed, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket blocked: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update ticket observed behaviour ]**************************************** */
router.post('/update/ticket/expected', (request, response) => {
    let data = request.body;
    database.query('UPDATE tickets SET expectedBehaviour = ?, lastModified = ? WHERE id = ?', [data.expected, data.lastModified, data.tid], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at ticket blocked: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update comment ]************************************************** */
router.post('/update/comment', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('UPDATE comments SET val = ?, lastModified = ? WHERE created = ?', [data.val, data.lastModified, data.created], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            // response.send({success: 0});
            console.log('Database error at components: ' + error);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ update worklog ]************************************************** */
router.post('/update/worklog', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('UPDATE worklogs SET val = ?, lastModified = ?, hours = ? WHERE created = ?', [data.val, data.lastModified, data.hours, data.created], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at components: ' + error);
            return;
        }
        
        database.query('UPDATE tickets SET logged = logged + ? WHERE id = ?', [data.hours - data.lastLog, data.ticketId], (error, result, fields) => {
            if(error){
                console.log('Error at modifing log ' + error.code);
                return;
            }
            response.statusCode == 200;
            response.send({success: 1});
        });
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ remove comment ]************************************************** */
router.post('/remove/comment', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('DELETE FROM comments WHERE created = ?', data.created, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            console.log('Database error at comments: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ remove worklog ]************************************************** */
router.post('/remove/worklog', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('DELETE FROM worklogs WHERE created = ?', data.created, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            console.log('Database error at worklogs: ' + error.code);
            return;
        }
        database.query('UPDATE tickets SET logged = logged - ? WHERE id = ?', [data.hours, data.ticketId], (error, result, fields) => {
            if(error){
                response.statusCode == 400;
                console.log('Database error when removing hours from ticket: ' + error.code);
                return;
            }
            response.statusCode == 200;
            response.send({success: 1});
        })
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ get project details ]********************************************* */
router.get('/get/project/:id', (request, response) => {
    let data = request.body;
    database.query('SELECT * FROM projects WHERE id = ?', request.params.id, (error, result1, fields) => {
        if(error){
            console.log('Database error at project: ' + error.code);
            return;
        }
        let project = result1[0];

        database.query('SELECT * FROM releases WHERE project = ?', request.params.id, (error, result2, fields) => {
            if(error){
                console.log('Database error at project: ' + error.code);
                return;
            }
            let releases = result2;

            database.query('SELECT * FROM disciplines WHERE project = ?', request.params.id, (error, result3, fields) => {
                if(error){
                    console.log('Database error at project: ' + error.code);
                    return;
                }
                let cats = result3;

                response.statusCode == 200;
                response.send({project: project, releases: releases, categories: cats});
            });
        });
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ set project name ]********************************************* */
router.post('/project/setname', (request, response) => {
    let data = request.body;
    database.query('UPDATE projects SET name = ?, lastModified = ? WHERE id = ?', [data.name, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/setshortname', (request, response) => {
    let data = request.body;
    database.query('UPDATE projects SET shortName = ?, lastModified = ? WHERE id = ?', [data.name, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/setstartdate', (request, response) => {
    let data = request.body;
    database.query('UPDATE projects SET startDate = ?, lastModified = ? WHERE id = ?', [data.date, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/setduedate', (request, response) => {
    let data = request.body;
    database.query('UPDATE projects SET endDate = ?, lastModified = ? WHERE id = ?', [data.date, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/removerelease', (request, response) => {
    let data = request.body;
    database.query('DELETE FROM releases WHERE id = ?', [data.rid, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        
        database.query('SELECT * FROM releases', (error, result, fields) => {
            if(error){
                response.statusCode == 400;
                response.send({success: 0});
                console.log('Database error at project: ' + error.code);
                return;
            }

            response.statusCode == 200;
            response.send({success: 1, releases: result});
        });

        database.query('UPDATE projects SET lastModified = ? WHERE id = ?', [data.lastModified, data.id], (error, result, fields));
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/addrelease', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('INSERT INTO releases SET ?', data.release, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        database.query('SELECT * FROM releases', (error, result, fields) => {
            if(error){
                response.statusCode == 400;
                response.send({success: 0});
                console.log('Database error at project: ' + error.code);
                return;
            }
            response.statusCode = 200;
            response.send({success: 1, releases: result});
        });

        database.query('UPDATE projects SET lastModified = ? WHERE id = ?', [data.lastModified, data.id], (error, result, fields));
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/addcategory', (request, response) => {
    let data = request.body;
    console.log(data);
    database.query('INSERT INTO disciplines SET ?', data.category, (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        database.query('SELECT * FROM disciplines', (error, result, fields) => {
            if(error){
                response.statusCode == 400;
                response.send({success: 0});
                console.log('Database error at project: ' + error.code);
                return;
            }
            response.statusCode = 200;
            response.send({success: 1, categories: result});
        });
        database.query('UPDATE projects SET lastModified = ? WHERE id = ?', [data.lastModified, data.id]);
    });
});
/* ********************************************************************************************************************* */
/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/removecategory', (request, response) => {
    let data = request.body;
    database.query('DELETE FROM disciplines WHERE id = ?', [data.cid, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        
        database.query('SELECT * FROM disciplines', (error, result, fields) => {
            if(error){
                response.statusCode == 400;
                response.send({success: 0});
                console.log('Database error at project: ' + error.code);
                return;
            }

            response.statusCode == 200;
            response.send({success: 1, categories: result});
        });

        database.query('UPDATE projects SET lastModified = ? WHERE id = ?', [data.lastModified, data.id], (error, result, fields));
    });
});
/* ********************************************************************************************************************* */

/* *************************************************[ set project shortname ]********************************************* */
router.post('/project/setdescription', (request, response) => {
    let data = request.body;
    database.query('UPDATE projects SET description = ?, lastModified = ? WHERE id = ?', [data.description, data.lastModified, data.id], (error, result, fields) => {
        if(error){
            response.statusCode == 400;
            response.send({success: 0});
            console.log('Database error at project: ' + error.code);
            return;
        }
        response.statusCode == 200;
        response.send({success: 1});
    });
});
/* ********************************************************************************************************************* */
app.use(router);
https.createServer({key: fs.readFileSync('ssl/key.pem'), cert: fs.readFileSync('ssl/cert.pem')}, app).listen(8080);
