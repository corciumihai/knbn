const database = require('../../../database/database');
var bcrypt = require('bcryptjs');

class UserSchema{
    static findUser(username, callback){        
        database.query('SELECT email, password FROM users WHERE email = ?', username, (error, result, fields) => {
            if(error){
                callback(error, null);
                return;
            }
            if(result[0] == undefined){
                callback(null, null);
                return;
            }
            callback(null, result[0]);
        });
    }

    static validate(password, hashedPassword){
        return bcrypt.compareSync(password, hashedPassword);
    }
}

module.exports =  UserSchema;