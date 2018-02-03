import * as Immutable from 'immutable';
import { loop, Cmd } from 'redux-loop';
import { createReducer } from 'redux-act';
import { createAction } from 'redux-act';
import  loginApi  from '../apis/login';


export const login = createAction("login");
export const user = createAction("user");
export const failLogin = createAction("failLogin");


const INITIAL =Immutable.fromJS({
	adding:false,
	added:false,
	points:{}
});


const ACTIONS = {

    [login]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(loginApi.login,{
				successActionCreator : user,
				failActionCreator: failLogin,
				args: [payload]
			})
			)
	},
	[user]: (data,payload)=>{
		return data.set("user",payload.payload)
    },
    [failLogin]:(data,payload)=>{
		return data.set("failLogin",payload);
	},

}

const REDUCER = createReducer(ACTIONS, INITIAL);

export default REDUCER;
