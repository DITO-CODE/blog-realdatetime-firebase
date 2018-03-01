import $ from 'jquery';
import { urls } from '../properties/functionsUrl';
import {banners} from '../reducer/banners';

export default  {

    getBanners(values){
       
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().GETBANNERS,
                type: "POST",
                dataType: 'json',
                data:  values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    debugger;
                    if(data.status === 404){
                        //reject({error:"No se encontrarón banners"});
                        resolve([])
                    }else{
                        reject({error:"No se lograron obtener los banners"});
                    }
                    
                }
            });


        }).then(banners);
    }

}
