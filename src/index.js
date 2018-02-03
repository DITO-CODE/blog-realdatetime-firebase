import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import  firebaseProps from './properties/properties';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import allReducers from './reducer';
import { install } from 'redux-loop';
import registerServiceWorker from './registerServiceWorker';

//Screens
import App from './App';

firebase.initializeApp(firebaseProps());

const store = createStore(allReducers,{},install());

ReactDOM.render((
        <Provider store={store}>
           <App />
        </Provider>
	), document.getElementById('root'));
registerServiceWorker();
