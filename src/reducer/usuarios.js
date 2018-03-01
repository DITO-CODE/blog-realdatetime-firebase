import * as Immutable from 'immutable';
import { loop, Cmd } from 'redux-loop';
import { createReducer } from 'redux-act';
import { createAction } from 'redux-act';
import  usuarioApi  from '../apis/usuarios';


export const getUsuarios = createAction("getUsuarios");
export const usuarios = createAction("usuarios");
export const failGetUsuarios = createAction("failGetUsuarios");

export const getUsuarioId = createAction("getUsuarioId");
export const usuario = createAction("usuario");
export const failGetUsuario = createAction("failGetUsuario");

export const addUsuario = createAction("addUsuario");
export const usuarioAdded = createAction("usuarioAdded");
export const failAddedUser = createAction("failAddedUser");

export const delUsuario = createAction("delUsuario");
export const usuarioDeleted = createAction("usuarioDeleted");
export const failDelUsuario = createAction("failDelUsuario");



export const getUsuariosSuscritos = createAction("getUsuariosSuscritos");
export const usuariosSuscritos = createAction("usuariosSuscritos");
export const failGetUsuariosSuscritos = createAction("failGetUsuariosSuscritos");


const INITIAL =Immutable.fromJS({
	adding:false,
	added:false,
	points:{}
});


const ACTIONS = {

    [getUsuarios]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(usuarioApi.getUsuarios,{
				successActionCreator : usuarios,
				failActionCreator: failGetUsuarios,
				args: [payload]
			})
			)
	},
	[usuarios]: (data,payload)=>{
		return data.set("usuarios",payload.payload).set("failGetUsuarios",null)
    },
    [failGetUsuarios]:(data,payload)=>{
		return data.set("failGetUsuarios",payload).set("usuarios",null);
    },
    [getUsuarioId]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(usuarioApi.getUsuarioId,{
				successActionCreator : usuarios,
				failActionCreator: failGetUsuario,
				args: [payload]
			})
			)
	},
	[usuarios]: (data,payload)=>{
		return data.set("usuarios",payload.payload)
    },
    [failGetUsuario]:(data,payload)=>{
		return data.set("failGetUsuario",payload);
    },
    [addUsuario]: (data,payload)=>{
			return loop(
				data,
				Cmd.run(usuarioApi.addUsuario,{
					successActionCreator : usuarioAdded,
					failActionCreator: failAddedUser,
					args: [payload]
				})
				)
		},
		[usuarioAdded]: (data,payload)=>{
			return data.set("usuarioAdded",payload.payload).set("usuarioDeleted",null).set("failAddedUser",null)
			},
		[failAddedUser]:(data,payload)=>{
			return data.set("failAddedUser",payload).set("usuarioAdded",null);
		},
		[delUsuario]: (data,payload)=>{
			return loop(
				data,
				Cmd.run(usuarioApi.delUsuario,{
					successActionCreator : usuarioDeleted,
					failActionCreator: failDelUsuario,
					args: [payload]
				})
				)
		},
		[usuarioDeleted]: (data,payload)=>{
			return data.set("usuarioDeleted",payload.payload).set("usuarioAdded",null).set("failAddedUser",null)
			},
		[failDelUsuario]:(data,payload)=>{
			return data.set("failDelUsuario",payload);
		},
		[getUsuariosSuscritos]: (data,payload)=>{
			return loop(
				data,
				Cmd.run(usuarioApi.getUsuariosSuscritos,{
					successActionCreator : usuariosSuscritos,
					failActionCreator: failGetUsuariosSuscritos,
					args: [payload]
				})
				)
		},
		[usuariosSuscritos]: (data,payload)=>{
			return data.set("usuariosSuscritos",payload.payload).set("failGetUsuariosSuscritos",null)
		},
		[failGetUsuariosSuscritos]:(data,payload)=>{
			return data.set("failGetUsuariosSuscritos",payload).set("usuariosSuscritos",null);
		},

}

const REDUCER = createReducer(ACTIONS, INITIAL);

export default REDUCER;
