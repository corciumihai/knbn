const database = require('./database/database');
const secret = require('./public/js/securityVariables');
let jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

module.exports = class JwtToken{
    login(request, response){
        let username = request.body.username;
        let password = request.body.password;

        if(username){
            database.query('SELECT * FROM users WHERE email = ?', username, (error, result, fields) => {
                if(error){
                    response.status(500);
                    response.json({error: 'Eroare internă ' + error.code});
                }
                else{
                    let databaseData = result[0];
                    
                    if(!databaseData){
                        response.status(404);
                        response.json({error: 'E-mail-ul nu există în sistem'});
                    }
                    else{
                        bcrypt.compare(password, databaseData.password, (error, result) => {
                            if(error){
                                response.status(500);
                                response.json({error: 'Eroare internă ' + error});
                            }
                            else{
                                if(result){
                                    let payload = {username: username, password: password};
                                    let token = jwt.sign(
                                        payload,
                                        secret.secret,
                                        {expiresIn: '30m'}
                                    );
    
                                    response.status(200);
                                    response.json({jwtToken: token});
                                }
                                else{
                                    response.status(500);
                                    response.json({error: 'Parolă greșită'});
                                }
                            }
                        });   
                    }
                }
            });
        }
    }

    checkToken(request, response, next){
        const token = 
        request.body.jwtToken ||
        request.query.jwtToken || 
        request.headers['x-access-token'] || 
        request.cookies.jwtToken;

        if(!token){
            response.sendStatus(401);
        }
        else{
            jwt.verify(token, secret.secret, (error, decoded) => {
                if(error){
                    response.sendStatus(401);
                }
                else{
                    // request.email = decoded.email;
                    next();
                }
            })
        }
    }
}