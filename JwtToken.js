const database = require('./database/database');
const secret = require('./public/js/securityVariables');
let jwt = require('jsonwebtoken');

module.exports = class JwtToken{
    login(request, response){
        let username = request.body.username;
        let password = request.body.password;

        if(username && password){
            database.query('SELECT * FROM users WHERE email = ?', username, (error, result, fields) => {
                let databaseData = result[0];

                if(databaseData && password == databaseData.password){
                    const payload = {username};

                    let token = jwt.sign(
                        payload,
                        secret.secret,
                        {expiresIn: '30m'}
                    );
                        
                    response.json({jwtToken: token});
                }
                else{
                    response.sendStatus(400).json({
                        success: false, 
                        message: 'Authentication failed'
                    });
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
                    response.sendStatus(400);
                }
                else{
                    request.email = decoded.email;
                    next();
                }
            })
        }
    }
}