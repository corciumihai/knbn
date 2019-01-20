import {createStore} from 'redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var jwt = require('jsonwebtoken');
import axios from 'axios';
import crypto from 'crypto';

var initialState = {};

// get theme toggle cookie state
initialState = {
    themeToggled: cookies.get('darkmode') == "true",
    currentUser: '',
    priorities: [{id: 0, name: 'Minimă', dbName: 'low'}, {id: 1, name: 'Medie', dbName: 'medium'}, {id: 2, name: 'Maximă', dbName: 'high'}]
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'THEME_TOGGLE': {
            cookies.set('darkmode', !state.themeToggled, {path: '/'});
            return Object.assign({}, state, {
                themeToggled: !state.themeToggled
            });
        }

        case 'KNBN_LOAD_TOKEN': {
            let token = cookies.get('jwtToken');
            let decoded = jwt.decode(token);

            return Object.assign({}, state, {
                currentUser: decoded.username
            });
        }

        case 'KNBN_SET_TOKEN': {
            cookies.set('jwtToken', action.payload, {path: '/'});
            let decoded = jwt.decode(action.payload);
            
            return Object.assign({}, state, {
                jwtToken: action.payload,
                currentUser: decoded.username
            });
        }

        case 'KNBN_SET_TOKEN_EXPIRE': {
            cookies.set('jwtToken', {maxAge: Date.now()});
        }

        default: {
            return state;
        }
    }
}

const store = createStore(reducer);

export default store;