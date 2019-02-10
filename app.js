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
const striptags = require('striptags');

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

app.get('/', function(request, response){
        response.render(path.resolve(__dirname, 'views', 'spa.pug'));
    }
);

app.get('/logout', function(request, response){});

app.post('/register', (request, response) => {
    let data = request.body;

    bcrypt.hash(data.password, 10, (error, hash) => {
        if(error) {
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

app.get('/user/:email', handlers.checkToken, (request, response) => {
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

app.get('/profile', handlers.checkToken, (request, response) => {
    response.render(path.resolve(__dirname, 'views', 'profile.pug'));
});

app.get('/users/get', handlers.checkToken, function(request, response){
    database.query('SELECT email, name from users', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/project/get/components/:projID', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM components WHERE project = ?', request.params.projID, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});


app.get('/component/get', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM components', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/category/multi/get', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM categories', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: "Eroare interna " + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/release/multi/get', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM releases', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: "Eroare interna " + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/category/multi/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM categories WHERE project = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: "Eroare interna " + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/release/multi/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM releases WHERE project = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: "Eroare interna " + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/release/get/:id', handlers.checkToken, (request, response) => {
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

app.get('/category/get/:id', handlers.checkToken, (request, response) => {
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

app.post('/reports/add', handlers.checkToken, (request, response) => {    
    database.query('INSERT INTO reports SET ?', request.body, (error, fields, result) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/add', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO tickets SET ?', request.body, (error, fields, result) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/add', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO components SET ?', request.body, (error, fields, result) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/add/project', handlers.checkToken, (request, response) => {
    let data = request.body;

    let categories = data.categories;
    let releases = data.releases;

    delete data.categories;
    delete data.releases;

    data.startDate = new Date();

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

            response.sendStatus(200);
        }
    });
    }
});

app.get('/category/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT name FROM categories WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    });
});

app.get('/release/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT name FROM releases WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    });
});

app.get('/component/get/tickets/:compID', handlers.checkToken, (request, response) => {
    database.query('SELECT id, lane, component, name, assignee, reporter FROM tickets WHERE component = ?', request.params.compID, (error, result, fields) => {
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

app.get('/component/get/reports/:compID', handlers.checkToken, (request, response) => {
    database.query('SELECT id, lane, component, name, assignee, reporter FROM reports WHERE component = ?', request.params.compID, (error, result, fields) => {
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

app.get('/tickets/get', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM tickets', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    });
});

app.get('/component/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM components WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    });
});

app.post('/component/set/name', handlers.checkToken, (request, response) => {
    database.query('UPDATE components SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/set/desc', handlers.checkToken, (request, response) => {
    database.query('UPDATE components SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/set/release', handlers.checkToken, (request, response) => {
    database.query('UPDATE components SET releaseID = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/set/category', handlers.checkToken, (request, response) => {
    database.query('UPDATE components SET category = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/set/priority', handlers.checkToken, (request, response) => {
    database.query('UPDATE components SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/component/set/owner', handlers.checkToken, (request, response) => {
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

app.post('/ticket/set/dueDate', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET dueDate = ? WHERE id = ?', [request.body.date, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/dueDate', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET dueDate = ? WHERE id = ?', [request.body.date, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/name', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/name', handlers.checkToken, (request, response) => {
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

app.post('/report/set/blocked', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET blocked = ? WHERE id = ?', [request.body.ticket.id, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/estimation', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET estimation = ? WHERE id = ?', [parseInt(request.body.value), request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/estimation', handlers.checkToken, (request, response) => {
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

app.post('/ticket/set/desc', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/desc', handlers.checkToken, (request, response) => {
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

app.post('/ticket/set/priority', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/priority', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET priority = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/release', handlers.checkToken, (request, response) => {    
    database.query('UPDATE tickets SET releaseID = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: "Eroare interna " + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/release', handlers.checkToken, (request, response) => {  
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

app.post('/ticket/set/category', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET category = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/category', handlers.checkToken, (request, response) => {
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

app.post('/ticket/set/assignee', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET assignee = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/assignee', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET assignee = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/set/reporter', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET reporter = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/reporter', handlers.checkToken, (request, response) => {
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

app.get('/ticket/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM tickets WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    });
});

app.get('/report/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM reports WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    });
});

app.get('/project/getall', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM projects', (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    });
});

app.get('/project/get/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM projects WHERE id = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code})
        }
        else{
            response.statusCode = 200;
            response.send(result[0]);
        }
    })
});

app.post('/ticket/update/lane', handlers.checkToken, (request, response) => {
    database.query('UPDATE tickets SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }else{
            response.sendStatus(200);
        }
    })
});

app.post('/ticket/add/comment', handlers.checkToken, (request, response) => {    
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

app.post('/ticket/update/comment', handlers.checkToken, (request, response) => {    
    let temp = striptags(request.body.value);

    if(temp.length){
        database.query('UPDATE ticket_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                response.status(500);
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.sendStatus(200);
            }       
        })
    }
    else{
        database.query('DELETE FROM ticket_comments WHERE id = ?', request.body.id, (error, result, fields) => {
            if(error){
                response.status(500);
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.sendStatus(200);
            }       
        })
    }
});

app.get('/ticket/get/comments/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM ticket_comments WHERE ticket = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.send(result);
        }
    })
})

app.post('/ticket/remove/comment', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM ticket_comments WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/report/remove/comment', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM report_comments WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/report/remove/worklog', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM report_worklogs WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.get('/ticket/get/hours/:id', handlers.checkToken, (request, response) => {
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

app.post('/report/update/lane', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET lane = ? WHERE id = ?', [request.body.lane, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }else{
            response.sendStatus(200);
        }
    })
});

app.post('/report/add/comment', handlers.checkToken, (request, response) => {
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

app.post('/report/update/comment', handlers.checkToken, (request, response) => {
    let temp = striptags(request.body.value);

    if(temp.length){
        database.query('UPDATE report_comments SET value = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
            if(error){
                response.status(500);
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.sendStatus(200);
            }       
        })
    }
    else{
        database.query('DELETE FROM report_comments WHERE id = ?', request.body.id, (error, result, fields) => {
            if(error){
                response.status(500);
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.sendStatus(200);
            }       
        })
    }
});

app.get('/report/get/comments/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM report_comments WHERE report = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
})

app.get('/report/get/hours/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT SUM(hours) AS hours FROM report_worklogs WHERE report = ?', request.params.id, (error, result, fields) => {
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

app.get('/search/report/:term', handlers.checkToken, (request, response) => {
    if(request.params.term != 'undefined'){
        database.query('SELECT * FROM reports WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode = 200;
                response.send(result);
            }
        })
    }
    else{
        console.log('aa')
        database.query('SELECT * FROM reports', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode = 200;
                response.send(result);
            }
        })
    }
});

app.get('/search/ticket/:term', handlers.checkToken, (request, response) => {
    if(request.params.term != 'undefined'){
        database.query('SELECT * FROM tickets WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
    else{
        database.query('SELECT * FROM tickets', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
    
});

app.get('/search/component/:term', handlers.checkToken, (request, response) => {
    if(request.params.term != 'undefined'){
        database.query('SELECT * FROM components WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
    else{
        database.query('SELECT * FROM components', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
   
});

app.get('/search/project/:term', handlers.checkToken, (request, response) => {
    if(request.params.term != 'undefined'){
        database.query('SELECT * FROM projects WHERE name LIKE "%' + request.params.term + '%"', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
    else{
        database.query('SELECT * FROM projects', (error, result, fields) => {
            if(error){
                response.statusCode = 500;
                response.json({error: 'Eroare interna ' + error.code});
            }
            else{
                response.statusCode= 200;
                response.send(result);
            }
        })
    }
    
});

app.post('/ticket/add/worklog', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO tickets_worklogs SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
});

app.post('/report/add/worklog', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO report_worklogs SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode= 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
});

app.post('/ticket/update/worklog', handlers.checkToken, (request, response) => {
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

app.post('/report/update/worklog', handlers.checkToken, (request, response) => {
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

app.post('/report/set/teststeps', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET testSteps = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/expected', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET expected = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/report/set/observed', handlers.checkToken, (request, response) => {
    database.query('UPDATE reports SET observed = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
});

app.post('/ticket/remove/worklog', handlers.checkToken, (request, response) => {
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

app.get('/ticket/get/worklogs/:id', handlers.checkToken, (request, response) => {
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

app.get('/report/get/worklogs/:id', handlers.checkToken, (request, response) => {
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

app.post('/project/set/name', handlers.checkToken, (request, response) => {
    database.query('UPDATE projects SET name = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/project/set/wip', handlers.checkToken, (request, response) => {
    database.query('UPDATE projects SET wip = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/project/set/desc', handlers.checkToken, (request, response) => {
    database.query('UPDATE projects SET description = ? WHERE id = ?', [request.body.value, request.body.id], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.get('/project/get/categories/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM categories WHERE project = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.get('/project/get/releases/:id', handlers.checkToken, (request, response) => {
    database.query('SELECT * FROM releases WHERE project = ?', request.params.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
})

app.post('/project/add/category', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO categories SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.post('/project/add/release', handlers.checkToken, (request, response) => {
    database.query('INSERT INTO releases SET ?', request.body, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
});

app.post('/project/remove/category', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM categories WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
})

app.post('/project/remove/release', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM releases WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.statusCode = 200;
            response.send(result);
        }
    })
})

app.post('/user/set/name', handlers.checkToken, (request, response) => {
    database.query('UPDATE users SET name = ? WHERE email = ?', [request.body.value, request.body.email], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/user/set/company', handlers.checkToken, (request, response) => {
    database.query('UPDATE users SET company = ? WHERE email = ?', [request.body.value, request.body.email], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/user/set/admin/', handlers.checkToken, (request, response) => {
    database.query('UPDATE users SET isAdmin = 1 WHERE email = ?', [request.body.email], (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare interna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/ticket/remove', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM tickets WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare iterna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/report/remove', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM reports WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare iterna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/component/remove', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM components WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare iterna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    })
})

app.post('/project/remove', handlers.checkToken, (request, response) => {
    database.query('DELETE FROM projects WHERE id = ?', request.body.id, (error, result, fields) => {
        if(error){
            response.statusCode = 500;
            response.json({error: 'Eroare iterna ' + error.code});
        }
        else{
            response.sendStatus(200);
        }
    });
})

/* ********************************************************************************************************************* */
https.createServer({key: fs.readFileSync('ssl/key.pem'), cert: fs.readFileSync('ssl/cert.pem')}, app).listen(8080);
