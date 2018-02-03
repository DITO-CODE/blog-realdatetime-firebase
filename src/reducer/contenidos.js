import * as Immutable from 'immutable';
import { loop, Cmd } from 'redux-loop';
import { createReducer } from 'redux-act';
import { createAction } from 'redux-act';
import  contenidoApi  from '../apis/contenidos';


export const getContenidos = createAction("getContenidos");
export const contenidos = createAction("contenidos");
export const failGetContenidos = createAction("failGetContenidos");

export const getContenidoId = createAction("getContenidoId");
export const contenido = createAction("contenido");
export const failGetContenido = createAction("failGetContenido");

export const addContenido = createAction("addContenido");
export const contenidoAdded = createAction("contenidoAdded");
export const failAdded = createAction("failAdded");

export const delContenido = createAction("delContenido");
export const contenidoDeleted = createAction("contenidoDeleted");
export const failDelContenido = createAction("failDelContenido");


const INITIAL =Immutable.fromJS({
	adding:false,
	added:false,
	points:{}
});


const ACTIONS = {

    [getContenidos]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(contenidoApi.getContenidos,{
				successActionCreator : contenidos,
				failActionCreator: failGetContenidos,
				args: [payload]
			})
			)
	},
	[contenidos]: (data,payload)=>{
		return data.set("contenidos",payload.payload).set("failGetContenidos",null)
    },
    [failGetContenidos]:(data,payload)=>{
		return data.set("failGetContenidos",payload).set("contenidos",null);
    },
    [getContenidoId]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(contenidoApi.getContenidoId,{
				successActionCreator : contenido,
				failActionCreator: failGetContenidos,
				args: [payload]
			})
			)
	},
	[contenido]: (data,payload)=>{
		return data.set("contenido",payload.payload)
    },
    [failGetContenido]:(data,payload)=>{
		return data.set("failGetContenido",payload);
    },
    [addContenido]: (data,payload)=>{
			return loop(
				data,
				Cmd.run(contenidoApi.addContenido,{
					successActionCreator : contenidoAdded,
					failActionCreator: failGetContenidos,
					args: [payload]
				})
				)
		},
		[contenidoAdded]: (data,payload)=>{
			return data.set("contenidoAdded",payload.payload).set("contenidoDeleted",null)
			},
		[failAdded]:(data,payload)=>{
			return data.set("failAdded",payload);
		},
		[delContenido]: (data,payload)=>{
			return loop(
				data,
				Cmd.run(contenidoApi.delContenido,{
					successActionCreator : contenidoDeleted,
					failActionCreator: failDelContenido,
					args: [payload]
				})
				)
		},
		[contenidoDeleted]: (data,payload)=>{
			return data.set("contenidoDeleted",payload.payload).set("contenidoAdded",null)
			},
		[failDelContenido]:(data,payload)=>{
			return data.set("failDelContenido",payload);
		}

}

const REDUCER = createReducer(ACTIONS, INITIAL);

export default REDUCER;
