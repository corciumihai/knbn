import {createStore} from 'redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import axios from 'axios';
import crypto from 'crypto';

var initialState = {};

// get theme toggle cookie state
initialState = {
    themeToggled: cookies.get('darkmode') == "true",
    currentUser: {},
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

        case 'KNBN_SET_USER': {
            return Object.assign({}, state, {
                currentUser: action.payload
            });
        }

        default: {
            return state;
        }
    }
}

const store = createStore(reducer);

export default store;