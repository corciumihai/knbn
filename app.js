const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./database/database');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const JwtToken = require('./JwtToken');

let handlers = new JwtToken();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/login', handlers.login);

app.get('/checktoken', 
handlers.checkToken,
function(request, response){
    response.sendStatus(200);
});

app.get('/', 
    // handlers.checkToken,
    function(request, response){
        response.render(path.resolve(__dirname, 'views', 'spa.pug'));
    }
);

app.get('/logout', function(request, response){
});

app.post('/checkuser', (request, response) => {
    var query = database.query('SELECT * FROM users WHERE email = ?', request.body.email, function(error, result, fields){
        if(error){
            response.send({success: false, erroruser: false, errorpassword: false, errordb: true});
        }
        data = result[0];
        if(data == undefined || data.length == 0){
            response.send({success: false, erroruser: true});
        }
        else{
            let result = false;
            bcrypt.compare(request.body.password, data.password, function(err, res){
                console.log()
            });
            
            if(result){
                response.send({success: false, errorpassword: false});
            }
            else{
                response.send({success: true})
            }
        }        
    });
});

app.post('/register', (request, response) => {
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

app.get('/current-user', (request, response) => {
    // if(request.isAuthenticated()){
        // response.send({email: request.user.email, name: request.user.name});
    // }
    // else{
        // response.send({success: false});
    // }
});

app.get('/user/:email', (request, response) => {
    database.query('SELECT name FROM users WHERE email = ?', [request.params.email], (error, result, fields) => {
        if(error || result == undefined || result.length == 0){
            response.send({success: false}); return;
        }
        response.send({success: true, name: result[0].name});
    });
});

app.get('/user/get-user-by-email/:email', (request, response) => {
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

app.get('/profile', (request, response) => {
    response.render(path.resolve(__dirname, 'views', 'profile.pug'));
});

app.get('/users/get-users', function(request, response){
    var query = database.query('SELECT email, name from users', (error, result, fields) => {
        if(error){
            console.log('Databse error at users: ' + error);
            return;
        }
        response.send(result);
    })
});

app.get('/create-cmp', (request, response) => {
    response.render(path.resolve(__dirname, 'views', 'cmpSetup.pug'));
});

app.get('/get-components/:projID', (request, response) => {
    database.query('SELECT * FROM components WHERE project = ?', request.params.projID, (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 1: ' + error.code);
            return;
        }
        response.send(result);
    })
});

app.get('/get-components', (request, response) => {
    database.query('SELECT * FROM components', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 2: ' + error.code);
            return;
        }
        response.send(result);
    })
});

app.get('/get-categories', (request, response) => {
    database.query('SELECT id, name FROM categories', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 3: ' + error.code);
            return;
        }
        response.send(result);
    })
});

app.get('/get-releases', (request, response) => {
    database.query('SELECT * FROM releases', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 4: ' + error.code);
            response.send([]);;
        }
        response.send(result);
    })
});

app.get('/get-release/:id', (request, response) => {
    database.query('SELECT * FROM releases WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 5: ' + error.code);
            response.send({});;
        }
        response.send(result[0]);
    })
});

app.post('/add/ticket', (request, response) => {
    var reporter = request.user.email;
    let data = request.body;

    data.reporter = reporter;
    
    database.query('INSERT INTO tickets SET ?', data, (error, fields, result) => {
        if(error){console.log(error); response.send({success: false, error: error.sqlMessage});}
    });
});

app.post('/add-pr', (request, response) => {
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
});

app.post('/add-ticket', (request, response) => {
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
});

app.post('/add-cmp', (request, response) => {
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
});

app.post('/add-component-comment', (request, response) => {
    database.query('INSERT INTO components_comments SET ?', request.body, (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        response.send({success: true});
    });
});

app.post('/add-project', (request, response) => {
    database.query('INSERT INTO projects SET ?', request.body, (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        response.send({success: true});
    });
});

app.get('/category/:id', (request, response) => {
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

app.get('/release/:id', (request, response) => {
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

app.post('/component/update-comment', (request, response) => {
    database.query('UPDATE components_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error);
            return;
        }
        // response.send({success: true});
    });
})

app.get('/get-component-comments/:id', (request, response) => {
    database.query('SELECT * FROM components_comments WHERE compID = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error);  return;}
        response.send(result);
    })
});

app.post('/remove-comment', (request, response) => {
    database.query('DELETE FROM components_comments WHERE id = ?', [request.body.id], (error, result, fields) => {
        if(error){
            console.log(error);  
            return;
        }
        response.send({success: true});
    })
});

app.get('/component/get-tickets/:compID', (request, response) => {
    database.query('SELECT * FROM tickets WHERE component = ?', request.params.compID, (error, result, fields) => {
        if(error){
            response.send([]);
        }
        response.send(result);
    });
});

app.get('/get-tickets/:projID', (request, response) => {
    database.query('SELECT * FROM tickets WHERE project = ?', request.params.projID, (error, result, fields) => {
        if(error){
            response.send([]);
            return;
        }
        response.send(result);
    });
});


app.get('/get-component-data/:id', (request, response) => {
    database.query('SELECT * FROM components WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({});
        }
        response.send(result[0]);
    });
});

app.post('/set-component/name', (request, response) => {
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

app.post('/set-component/desc', (request, response) => {
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

app.post('/set-component/release', (request, response) => {
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

app.post('/set-component/prio', (request, response) => {
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

app.post('/set-component/wip', (request, response) => {
    database.query('UPDATE components SET wip = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){console.log(error); return;}
    });
});

app.post('/set-component/owner', (request, response) => {
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

app.post('/set-component/due-date', (request, response) => {
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

app.post('/set-ticket/name', (request, response) => {
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

app.post('/set-component/estimation', (request, response) => {
    let value = parseInt(request.body.value);

    database.query('UPDATE tickets SET estimation = ? WHERE id = ?', [value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

app.post('/set-ticket/description', (request, response) => {
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

app.post('/set-ticket/priority', (request, response) => {
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

app.post('/set-ticket/release', (request, response) => {    
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

app.post('/set-ticket/assignee', (request, response) => {
    console.log(request.body);

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

app.post('/set-ticket/reporter', (request, response) => {
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

app.get('/get-ticket-data/:id', (request, response) => {
    database.query('SELECT * FROM tickets WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); return;}
        response.send(result[0]);
    });
});

app.get('/get-pr-data/:id', (request, response) => {
    database.query('SELECT * FROM prs WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); return;}
        response.send(result[0]);
    });
});

app.get('/get-projects', (request, response) => {
    database.query('SELECT * FROM projects', (error, result, fields) => {
        if(error){console.log(error); response.send([]);}
        response.send(result);
    });
});

app.get('/get-project-details/:id', (request, response) => {
    database.query('SELECT * FROM projects WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); response.send({})}
        else{
            response.send(result[0]);
        }
    })
});

app.post('/update-lane', (request, response) => {
    database.query('UPDATE tickets SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error);
            response.send({success: false});
        }else{
            response.send({success: true});
        }
    })
});

app.post('/ticket/add-comment/', (request, response) => {    
    database.query('INSERT INTO ticket_comments SET ?', request.body, (error, result, fields) => {
        if(error){
            response.sendStatus(400);
        }
        else{
            response.sendStatus(200);
        }       
    })
})

app.get('/ticket/get-comments/:id', (request, response) => {
    database.query('SELECT * FROM ticket_comments WHERE ticket = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.sendStatus(400);
        }
        else{
            response.send(result);
        }
    })
})

app.get('/search/:term', (request, response) => {
    let items = {};
    database.query('SELECT * FROM tickets WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
        items.tickets = result;

        database.query('SELECT * FROM reports WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
            items.reports = result;

            database.query('SELECT * FROM projects WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
                items.projects = result;

                database.query('SELECT * FROM components WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
                    items.components = result;
                    response.json(items);
                })
            })
        })
    });    
});

/* ********************************************************************************************************************* */
https.createServer({key: fs.readFileSync('ssl/key.pem'), cert: fs.readFileSync('ssl/cert.pem')}, app).listen(8080);
