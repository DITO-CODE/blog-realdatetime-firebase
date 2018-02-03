import {combineReducers} from 'redux-loop';
import login from './login';
import contenidos from './contenidos';

const reducer = combineReducers({
login,
contenidos
});

export default reducer;
