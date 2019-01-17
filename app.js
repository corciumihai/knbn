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
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
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

router.get('/', function(request, response){
    // if(request.isAuthenticated()){
        response.render(path.resolve(__dirname, 'views', 'spa.pug'));
    // }
    // else{response.redirect('/login');}
});

router.get('/logout', function(request, response){
    if(request.isAuthenticated()){
        request.logOut();
        response.redirect('/login');
    }
    else{response.redirect('/login');}
});

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

router.get('/current-user', (request, response) => {
    if(request.isAuthenticated()){
        response.send({email: request.user.email, name: request.user.name});
    }
    else{
        response.send({success: false});
    }
});

router.get('/user/:email', (request, response) => {
    database.query('SELECT name FROM users WHERE email = ?', [request.params.email], (error, result, fields) => {
        if(error || result == undefined || result.length == 0){
            response.send({success: false}); return;
        }
        response.send({success: true, name: result[0].name});
    });
});

router.get('/user/get-user-by-email/:email', (request, response) => {
    if(request.params.email != undefined && request.params.email.length > 0){
        database.query('SELECT * FROM users WHERE email = ?', request.params.email, (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({});
            }
            else{
                response.send(result[0]);
            }
        });
    }
    else{
        response.send({});
    }
});

router.get('/profile', (request, response) => {
    if(request.isAuthenticated()){
        response.render(path.resolve(__dirname, 'views', 'profile.pug'));
    } 
    else{
        response.redirect('/login');
    }
});

router.get('/users/get-users', function(request, response){
    var query = database.query('SELECT email, name from users', (error, result, fields) => {
        if(error){
            console.log('Databse error at users: ' + error);
            return;
        }
        response.send(result);
    })
});

router.get('/create-cmp', (request, response) => {
    if(request.isAuthenticated()){
        response.render(path.resolve(__dirname, 'views', 'cmpSetup.pug'));
    }
    else{response.redirect('/login');}
});

router.get('/get-components/:projID', (request, response) => {
    database.query('SELECT * FROM components WHERE project = ?', request.params.projID, (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});

router.get('/get-components', (request, response) => {
    database.query('SELECT * FROM components', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});

router.get('/get-categories', (request, response) => {
    database.query('SELECT id, name FROM disciplines', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            return;
        }
        response.send(result);
    })
});

router.get('/get-releases', (request, response) => {
    database.query('SELECT id, name FROM releases', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            response.send([]);;
        }
        response.send(result);
    })
});

router.get('/get-release/:id', (request, response) => {
    database.query('SELECT * FROM releases WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases: ' + error.code);
            response.send({});;
        }
        response.send(result[0]);
    })
});

router.post('/add/ticket', (request, response) => {
    if(request.isAuthenticated()){
        var reporter = request.user.email;
        let data = request.body;

        data.reporter = reporter;
        
        database.query('INSERT INTO tickets SET ?', data, (error, fields, result) => {
            if(error){console.log(error); response.send({success: false, error: error.sqlMessage});}
        });
    }
});

router.post('/add-pr', (request, response) => {
    // if(request.isAuthenticated()){
        let data = request.body;

        if(request.user != request.user && request.user.email != undefined){
            data.reporter = request.user.email;
        }else{
            data.reporter = '';
        }
        
        database.query('INSERT INTO prs SET ?', data, (error, fields, result) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            response.send({success: true})
        });
    // }
});

router.post('/add-ticket', (request, response) => {
    // if(request.isAuthenticated()){
        let data = request.body;

        if(request.user != request.user && request.user.email != undefined){
            data.reporter = request.user.email;
        }else{
            data.reporter = '';
        }
        
        database.query('INSERT INTO tickets SET ?', data, (error, fields, result) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            response.send({success: true})
        });
    // }
});

router.post('/add-cmp', (request, response) => {
    // if(request.isAuthenticated()){
        let data = request.body;      
        
        if(data.owner == undefined){
            if(request.user != request.user && request.user.email != undefined){
                data.owner = request.user.email;
            }else{
                data.owner = '';
            }
        }

        database.query('INSERT INTO components SET ?', data, (error, fields, result) => {
            if(error){
                console.log(error); 
                response.send({success: false, error: error.sqlMessage});
            }
            else{response.send({success: true})}
        });
    // }
});

router.post('/add-component-comment', (request, response) => {
    database.query('INSERT INTO components_comments SET ?', request.body, (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        response.send({success: true});
    });
});

router.post('/add-project', (request, response) => {
    database.query('INSERT INTO projects SET ?', request.body, (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        response.send({success: true});
    });
});

router.get('/category/:id', (request, response) => {
    if(request.params.id != undefined && request.params.id != null && request.params.id != 0){
        database.query('SELECT name FROM disciplines WHERE id = ?', request.params.id, (error, result, fields) => {
            if(error){
                console.log(error);
                response.send({});
                return;
            }
            response.send(result[0]);
        });
    }
    else{
        response.send({});
    }
    
});

router.get('/release/:id', (request, response) => {
    if(request.params.id != undefined && request.params.id != null && request.params.id != 0){
        database.query('SELECT name FROM releases WHERE id = ?', request.params.id, (error, result, fields) => {
            if(error){
                console.log(error);
                response.send({});
                return;
            }
            response.send(result[0]);
        });
    }
    else{
        response.send({});
    }
});

router.post('/component/update-comment', (request, response) => {
    database.query('UPDATE components_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        // response.send({success: true});
    });
})

router.get('/get-component-comments/:id', (request, response) => {
    console.log(request.params.id)
    database.query('SELECT * FROM components_comments WHERE compID = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error);  return;}
        response.send(result);
    })
});

router.post('/remove-comment', (request, response) => {
    database.query('DELETE FROM components_comments WHERE id = ?', [request.body.id], (error, result, fields) => {
        if(error){
            console.log(error);  
            return;
        }
        response.send({success: true});
    })
});

router.get('/component/get-tickets/:compID', (request, response) => {
    database.query('SELECT * FROM tickets WHERE component = ?', request.params.compID, (error, result, fields) => {
        if(error){
            response.send([]);
        }
        response.send(result);
    });
});

router.get('/get-tickets/:projID', (request, response) => {
    database.query('SELECT * FROM tickets WHERE project = ?', request.params.projID, (error, result, fields) => {
        if(error){
            response.send([]);
            return;
        }
        response.send(result);
    });
});


router.get('/get-component-data/:id', (request, response) => {
    database.query('SELECT * FROM components WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({});
        }
        response.send(result[0]);
    });
});

router.post('/set-component/name', (request, response) => {
    if(request.body.value != undefined && request.body.value.length > 0){
        database.query('UPDATE components SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-component/desc', (request, response) => {
    database.query('UPDATE components SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.post('/set-component/release', (request, response) => {
    if(request.body.value != undefined && request.body.value > 0){
        database.query('UPDATE components SET releaseID = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-component/prio', (request, response) => {
    database.query('UPDATE components SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.post('/set-component/wip', (request, response) => {
    database.query('UPDATE components SET wip = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){console.log(error); return;}
    });
});

router.post('/set-component/owner', (request, response) => {
    database.query('UPDATE components SET owner = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.post('/set-component/due-date', (request, response) => {
    database.query('UPDATE components SET dueDate = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.post('/set-ticket/name', (request, response) => {
    if(request.body.value != undefined && request.body.value.length > 0){
        database.query('UPDATE tickets SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-ticket/description', (request, response) => {
    if(request.body.value != undefined && request.body.value.length > 0){
        database.query('UPDATE tickets SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-ticket/priority', (request, response) => {
    if(request.body.value != undefined && request.body.value.length > 0){
        database.query('UPDATE tickets SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-ticket/release', (request, response) => {    
    if(request.body.value != undefined && request.body.value > 0){
        database.query('UPDATE tickets SET releaseID = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                console.log(error); 
                response.send({success: false});
            }
            else{
                response.send({success: true});
            }
        });
    }
    else{
        response.send({success: false});
    }
});

router.post('/set-ticket/assignee', (request, response) => {
    database.query('UPDATE tickets SET assignee = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.post('/set-ticket/reporter', (request, response) => {
    database.query('UPDATE tickets SET reporter = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

router.get('/get-ticket-data/:id', (request, response) => {
    database.query('SELECT * FROM tickets WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); return;}
        response.send(result[0]);
    });
});

router.get('/get-pr-data/:id', (request, response) => {
    database.query('SELECT * FROM prs WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); return;}
        response.send(result[0]);
    });
});

router.get('/get-projects', (request, response) => {
    database.query('SELECT * FROM projects', (error, result, fields) => {
        if(error){console.log(error); response.send([]);}
        response.send(result);
    });
});

router.get('/get-project-details/:id', (request, response) => {
    database.query('SELECT * FROM projects WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); response.send({})}
        else{
            response.send(result[0]);
        }
    })
});

router.post('/update-lane', (request, response) => {
    database.query('UPDATE tickets SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, fields, result) => {
        if(error){
            console.log(error);
            response.send({success: false});
        }else{
            response.send({success: true});
        }
    })
});

/* ********************************************************************************************************************* */
// use configured router
app.use(router);
// using user generated certificate and key
https.createServer({key: fs.readFileSync('ssl/key.pem'), cert: fs.readFileSync('ssl/cert.pem')}, app).listen(8080);
