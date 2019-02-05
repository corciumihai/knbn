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

app.get('/checktoken', handlers.checkToken, (request, response) => {
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

    bcrypt.hash(data.password, 10, (error, hash) => {
        if(error) {
            console.log(error);
            response.status(500);
            response.json({error: 'Eroare internă'});
        }
        else{
            let newData = data;
            delete newData.password;
            newData.password = hash;

            database.query('INSERT INTO users SET ?', newData, function(error, result, fields){
                if(error){
                    response.status(500);
                    response.json({error: 'Eroare internă ' + error.code});
                }
                else{
                    response.sendStatus(200);
                }
            });
        }
    })
    
});

app.get('/user/:email', (request, response) => {
    if(request.params.email != undefined && request.params.email.length > 0){
        database.query('SELECT * FROM users WHERE email = ?', request.params.email, (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna' + error.code});
            }
            else{
                response.statusCode = 200;
                response.send(result[0]);
            }
        });
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

app.get('/category/multi/get', (request, response) => {
    database.query('SELECT * FROM categories', (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }

        response.statusCode= 200;
        response.send(result);
    })
});

app.get('/release/multi/get', (request, response) => {
    database.query('SELECT * FROM releases', (error, result, fields) => {
        if(error){
            console.log('Database error when fetching releases 4: ' + error.code);
            response.send([]);;
        }
        response.send(result);
    })
});

app.get('/release/get/:id', (request, response) => {
    if(request.params.id){
        database.query('SELECT * FROM releases WHERE id = ?', request.params.id, (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode = 200;
                response.send(result[0]);
            }
        })
    }
});

app.get('/category/get/:id', (request, response) => {
    database.query('SELECT * FROM categories WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});;
        }
        else{
            response.statuse = 200;
            response.send(result[0]);
        }
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

app.post('/reports/add-report', (request, response) => {    
    console.log(request.body);

    database.query('INSERT INTO reports SET ?', request.body, (error, fields, result) => {
        if(error){
            console.log(error);
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
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

app.post('/component/add-component', (request, response) => {
    let data = request.body;      
    if(data.owner == undefined){
    }

    database.query('INSERT INTO components SET ?', data, (error, fields, result) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
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
    let data = request.body;

    let categories = data.categories;
    let releases = data.releases;

    delete data.categories;
    delete data.releases;

    data.startDate = new Date();
    console.log(data);

    if(data.name){
        database.query('INSERT INTO projects SET ?', data, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            let projectID = result.insertId;
            if(categories.length > 0){
                categories.map(category => {
                    database.query('INSERT INTO categories SET ?', {name: category.name, project: projectID}, (error, result, fields) => {
                        if(error){
                            response.statusCode= 500;
                            response.json({error: 'Eroare interna ' + error.code});
                        }
                    })
                })
            }

            if(releases.length > 0){
                releases.map(release => {
                    database.query('INSERT INTO releases SET ?', {name: release.name, project: projectID}, (error, result, fields) => {
                        if(error){
                            response.statusCode= 500;
                            response.json({error: 'Eroare interna ' + error.code});
                        }
                    })
                })
            }

            response.statusCode= 200;
            response.send();
        }
    });
    }
});

app.get('/category/:id', (request, response) => {
    if(request.params.id != undefined && request.params.id != null && request.params.id != 0){
        database.query('SELECT name FROM categories WHERE id = ?', request.params.id, (error, result, fields) => {
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
            response.statusCode = 500;
            response.json({error: 'Tichetele nu s-au putut fi incarcate ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    });
});

app.get('/component/get-reports/:compID', (request, response) => {
    database.query('SELECT * FROM reports WHERE component = ?', request.params.compID, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Tichetele nu s-au putut fi incarcate ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    });
});

app.get('/component/get-reports/:compID', (request, response) => {
    database.query('SELECT * FROM reports WHERE component = ?', request.params.compID, (error, result, fields) => {
        if(error){
            console.log(error);
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
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

app.get('/get-tickets', (request, response) => {
    database.query('SELECT * FROM tickets', request.params.projID, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.send([]);
        }
        else{
            response.statusCode= 200;
            response.send(result);
        }
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

app.post('/component/set-owner', (request, response) => {
    database.query('UPDATE components SET owner = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.send({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
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

app.post('/ticket/set/name', (request, response) => {
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

app.post('/report/set/name', (request, response) => {
    database.query('UPDATE reports SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/estimation', (request, response) => {
    database.query('UPDATE tickets SET estimation = ? WHERE id = ?', [parseInt(request.body.value), request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

app.post('/report/set/estimation', (request, response) => {
    database.query('UPDATE reports SET estimation = ? WHERE id = ?', [parseInt(request.body.value), request.body.id], (error, result, fields) => {
        if(error){
            response.status = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/description', (request, response) => {
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

app.post('/report/set/description', (request, response) => {
    database.query('UPDATE reports SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.send({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/priority', (request, response) => {
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

app.post('/report/set/priority', (request, response) => {
    database.query('UPDATE reports SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            console.log(error); 
            response.send({success: false});
        }
        else{
            response.send({success: true});
        }
    });
});

app.post('/ticket/set/release', (request, response) => {    
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

app.post('/report/set/release', (request, response) => {    
    database.query('UPDATE reports SET releaseID = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/category', (request, response) => {
    if(request.body.value){
        database.query('UPDATE tickets SET category = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                response.statusCode= 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.sendStatus(200);
            }
        });
    }
    else{
        response.statusCode= 500;
        response.json({error: 'Eroare interna'});
    }
});

app.post('/report/set/category', (request, response) => {
    database.query('UPDATE reports SET category = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    }); 
});

app.post('/ticket/set/assignee', (request, response) => {
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

app.post('/report/set/assignee', (request, response) => {
    database.query('UPDATE reports SET assignee = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);'/ticket/set/reporter'
        }
    });
});

app.post('/ticket/set/reporter', (request, response) => {
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

app.post('/report/set/reporter', (request, response) => {
    database.query('UPDATE reports SET reporter = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.get('/ticket/get-data/:id', (request, response) => {
    database.query('SELECT * FROM tickets WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){console.log(error); return;}
        response.send(result[0]);
    });
});

app.get('/report/get-data/:id', (request, response) => {
    database.query('SELECT * FROM reports WHERE id = ?', request.params.id, (error, result, fields) => {
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

app.post('/ticket/update-lane', (request, response) => {
    database.query('UPDATE tickets SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }else{
            response.sendStatus(200);
        }
    })
});

app.post('/ticket/add-comment', (request, response) => {    
    database.query('INSERT INTO ticket_comments SET ?', request.body, (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }       
    })
});

app.post('/ticket/update-comment', (request, response) => {    
    database.query('UPDATE ticket_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }       
    })
});

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

app.post('/ticket/remove/comment', (request, response) => {
    database.query('DELETE FROM ticket_comments WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.sendStatus(400);
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/report/remove/comment', (request, response) => {
    database.query('DELETE FROM report_comments WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.sendStatus(400);
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.get('/ticket/logged-hours/:id', (request, response) => {
    database.query('SELECT SUM(hours) AS hours FROM tickets_worklogs WHERE ticket = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.status(200);
            response.json(result[0]);
        }
    })
})




app.post('/report/update-lane', (request, response) => {
    if(!request.body.isReport){
        database.query('UPDATE reports SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }else{
                response.sendStatus(200);
            }
        })
    }
    
});

app.post('/report/add-comment', (request, response) => {    
    database.query('INSERT INTO report_comments SET ?', request.body, (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }       
    })
});

app.post('/report/update-comment', (request, response) => {    
    database.query('UPDATE report_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }       
    })
});

app.get('/report/get-comments/:id', (request, response) => {
    database.query('SELECT * FROM report_comments WHERE report = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            console.log('here');
            response.statusCode = 200;
            response.send(result);
        }
    })
})

// app.get('/report/logged-hours/:id', (request, response) => {
//     database.query('SELECT SUM(hours) AS hours FROM tickets_worklogs WHERE ticket = ?', request.params.id, (error, result, fields) => {
//         if(error){
//             response.status(500);
//             response.json({error: 'Eroare interna ' + error.code});
//         }
//         else{
//             response.status(200);
//             response.json(result[0]);
//         }
//     })
// })



app.post('/forgot', (request, response) => {
    database.query('SELECT * FROM users WHERE email = ?', request.body.email, (error, result, fields) => {
        if(error){
            response.status(500);
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            if(!result[0]){
                response.status(404);
                response.json({error: 'E-mail-ul nu există în baza de date'});
            }
            else{
                bcrypt.hash(request.body.password, 10, (error , hash) => {
                    if(error){
                        response.status(500);
                        response.json({error: 'Eroare interna ' + error});
                    }
                    else{
                        database.query('UPDATE users SET password = ? WHERE email = ?', [hash, request.body.email], (error, result, fields) => {
                            if(error){
                                response.status(500)
                                response.json({error: 'Eroare internă ' + error.code})
                            }
                            else{
                                response.sendStatus(200);
                            }
                        })
                    }
                })
            }
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

app.post('/ticket/add-worklog', (request, response) => {
    let data = request.body;
    data.created = new Date();
    database.query('INSERT INTO tickets_worklogs SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode= 200;
            response.send();
        }
    })
});

app.post('/report/add-worklog', (request, response) => {
    let data = request.body;
    data.created = new Date();
    database.query('INSERT INTO report_worklogs SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode= 200;
            response.send();
        }
    })
});

app.post('/ticket/update-worklog', (request, response) => {
    database.query('UPDATE tickets_worklogs SET comment = ?, hours = ? WHERE id = ?', [request.body.comment, request.body.hours, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
});

app.post('/report/update-worklog', (request, response) => {
    database.query('UPDATE report_worklogs SET comment = ?, hours = ? WHERE id = ?', [request.body.comment, request.body.hours, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
});

app.post('/ticket/remove/worklog', (request, response) => {
    console.log(request.body.id);

    database.query('DELETE FROM tickets_worklogs WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
});

app.get('/ticket/get-worklogs/:id', (request, response) => {
    database.query('SELECT * FROM tickets_worklogs WHERE ticket = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode= 200;
            response.send(result);
        }
    })
});

app.get('/report/get-worklogs/:id', (request, response) => {
    database.query('SELECT * FROM report_worklogs WHERE report = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode= 200;
            response.send(result);
        }
    })
});

/* ********************************************************************************************************************* */
https.createServer({key: fs.readFileSync('ssl/key.pem'), cert: fs.readFileSync('ssl/cert.pem')}, app).listen(8080);
