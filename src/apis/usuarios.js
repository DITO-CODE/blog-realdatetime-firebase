import $ from 'jquery';
import { urls } from '../properties/functionsUrl';
import {usuarios,usuario,usuarioAdded,usuarioDeleted,usuariosSuscritos} from '../reducer/usuarios';

export default  {

    getUsuarios(values){
       
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().GETUSUARIOS,
                type: "POST",
                dataType: 'json',
                data:  values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    debugger;
                    if(data.status === 404){
                        reject({error:"No se encontrarón usuarios"});
                    }else{
                        reject({error:"No se lograron obtener los usuarios"});
                    }
                    
                }
            });


        }).then(usuarios);
    },
    getUsuarioId(values){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().GETUSUARIOID,
                type: "POST",
                dataType: 'json',
                data: values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    reject({error:"No se logro obtener el usuario."});
                }
            });
        }).then(usuario);
    },
    addUsuario(values){
        /*Actualiza y agrega un contenido*/
        return new Promise((resolve,reject)=>{
            debugger;
            var uri = urls().ADDUSUARIO;
            if(values.id){
                uri = urls().UPDATEUSUARIO;
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
                    if(data.status === 500){                   
                        reject(data.responseJSON);
                    }else{
                        reject({error:"No se logro guardar al usuario."});
                    }
                }
            });
        }).then(usuarioAdded);
    },
    delUsuario(values){
        /*Actualiza y agrega un contenido*/
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().DELUSUARIO,
                type: "POST",
                dataType: 'json',
                data: values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    reject({error:"No se lograro eliminar al usuario."});
                }
            });
        }).then(usuarioDeleted);
    },
    getUsuariosSuscritos(values){
        
         return new Promise((resolve,reject)=>{
             $.ajax({
                 url: urls().GETUSUARIOSSUSCRITOS,
                 type: "POST",
                 dataType: 'json',
                 data:  values,
                 success: function(data,status,req){
                     resolve(data);
                 },
                 error: function(data,status,req){
                     debugger;
                     if(data.status === 404){
                         reject({error:"No se encontrarón usuarios"});
                     }else{
                         reject({error:"No se lograron obtener los usuarios"});
                     }
                     
                 }
             });
 
 
         }).then(usuariosSuscritos);
     }

}
