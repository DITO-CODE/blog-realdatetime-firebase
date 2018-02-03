import $ from 'jquery';
import { urls } from '../properties/functionsUrl';
import {contenidos,contenido,contenidoAdded,contenidoDeleted} from '../reducer/contenidos';

export default  {

    getContenidos(values){
       
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().GETCONTENIDOSFCH,
                type: "POST",
                dataType: 'json',
                data:  values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    debugger;
                    if(data.status === 404){
                        reject({error:"No se encontrarón artículos"});
                    }else{
                        reject({error:"No se lograron obtener los artículos"});
                    }
                    
                }
            });


        }).then(contenidos);
    },
    getContenidoId(values){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().GETCONTENIDOID,
                type: "POST",
                dataType: 'json',
                data: values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    reject({error:"No se lograron obtener los artículos"});
                }
            });
        }).then(contenido);
    },
    addContenido(values){
        /*Actualiza y agrega un contenido*/
        return new Promise((resolve,reject)=>{

            var uri = urls().ADDCONTENIDO;
            if(values.id){
                uri = urls().UPDATECONTENIDO;
            }

            $.ajax({
                url: uri,
                type: "POST",
                dataType: 'json',
                data: values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    reject({error:"No se lograron obtener los artículos"});
                }
            });
        }).then(contenidoAdded);
    },
    delContenido(values){
        /*Actualiza y agrega un contenido*/
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().DELCONTENIDO,
                type: "POST",
                dataType: 'json',
                data: values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    reject({error:"No se lograron obtener los artículos"});
                }
            });
        }).then(contenidoDeleted);
    }

}
