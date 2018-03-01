import {combineReducers} from 'redux-loop';
import login from './login';
import contenidos from './contenidos';
import usuarios from './usuarios';
import banners from './banners';

const reducer = combineReducers({
login,
contenidos,
usuarios,
banners
});

export default reducer;
