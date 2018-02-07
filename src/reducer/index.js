import {combineReducers} from 'redux-loop';
import login from './login';
import contenidos from './contenidos';
import usuarios from './usuarios';

const reducer = combineReducers({
login,
contenidos,
usuarios
});

export default reducer;
