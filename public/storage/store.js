import {createStore} from 'redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var jwt = require('jsonwebtoken');

var initialState = {};

// get theme toggle cookie state
initialState = {
    themeToggled: cookies.get('darkmode') == "true",
    currentUser: '',
    priorities: [{id: 0, name: 'Minimă', dbName: 'low'}, {id: 1, name: 'Medie', dbName: 'medium'}, {id: 2, name: 'Maximă', dbName: 'high'}],
    filterPR: cookies.get('filterPR') == 'true',
    userOnly: cookies.get('userOnly') == 'true',
    hiddenClosed: cookies.get('hiddenClosed') == 'true',
    filterTickets: cookies.get('filterTickets') == 'true',
    collapseAll: cookies.get('collapseAll') == 'true'
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'THEME_TOGGLE': {
            cookies.set('darkmode', !state.themeToggled, {path: '/'});
            return Object.assign({}, state, {
                themeToggled: !state.themeToggled
            });
        }

        case 'KNNB_TOGGLE_TICKETS': {
            cookies.set('filterTickets', !state.filterTickets, {path: '/', maxAge: 1800000});
            cookies.set('filterPR', state.filterPR == true ? false : false, {path: '/', maxAge: 1800000});
            return Object.assign({}, state, {
                filterTickets: !state.filterTickets,
                filterPR: state.filterPR == true ? false : false
            });
        }

        case 'KNNB_TOGGLE_PR': {
            cookies.set('filterPR', !state.filterPR, {path: '/', maxAge: 1800000});
            cookies.set('filterTickets', state.filterTickets == true ? false : false, {path: '/', maxAge: 1800000});
            return Object.assign({}, state, {
                filterPR: !state.filterPR,
                filterTickets: state.filterTickets == true ? false : false
            });
        }

        case 'KNNB_TOGGLE_HIDE_CLOSED': {
            cookies.set('hiddenClosed', !state.hiddenClosed, {path: '/', maxAge: 1800000}); 
            return Object.assign({}, state, {
                hiddenClosed: !state.hiddenClosed
            });
        }

        case 'KNNB_TOGGLE_COLLAPSE': {
            cookies.set('collapseAll', !state.collapseAll, {path: '/', maxAge: 1800000}); 
            return Object.assign({}, state, {
                collapseAll: !state.collapseAll
            });
        }

        case 'KNNB_TOGGLE_USER_ONLY': {   
            cookies.set('userOnly', !state.userOnly, {path: '/', maxAge: 1800000});          
            return Object.assign({}, state, {
                userOnly: !state.userOnly
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
            cookies.set('jwtToken', action.payload, {path: '/', maxAge: 1800000});                        
            return Object.assign({}, state, {
                jwtToken: action.payload,
            });
        }

        case 'KNBN_SET_TOKEN_EXPIRE': {
            cookies.set('jwtToken', {maxAge: Date.now()});
        }

        case 'KNBN_SET_ADMIN_RIGHT': {            
            return Object.assign({}, state, {
                isAdmin: action.payload
            })
        }

        default: {
            return state;
        }
    }
}

const store = createStore(reducer);

export default store;