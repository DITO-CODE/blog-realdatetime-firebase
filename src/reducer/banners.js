import * as Immutable from 'immutable';
import { loop, Cmd } from 'redux-loop';
import { createReducer } from 'redux-act';
import { createAction } from 'redux-act';
import  bannersApi  from '../apis/banners';


export const getBanners = createAction("getBanners");
export const banners = createAction("banners");
export const failGetBanners = createAction("failGetContenidos");


const INITIAL =Immutable.fromJS({
	adding:false,
	added:false,
	points:{}
});


const ACTIONS = {

    [getBanners]: (data,payload)=>{
		return loop(
			data,
			Cmd.run(bannersApi.getBanners,{
				successActionCreator : banners,
				failActionCreator: failGetBanners,
				args: [payload]
			})
			)
	},
	[banners]: (data,payload)=>{
		return data.set("banners",payload.payload).set("failGetBanners",null)
    },
    [failGetBanners]:(data,payload)=>{
		return data.set("failGetBanners",payload).set("banners",null);
    }

}

const REDUCER = createReducer(ACTIONS, INITIAL);

export default REDUCER;
