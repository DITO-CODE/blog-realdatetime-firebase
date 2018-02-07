var exports = module.exports = {};
const functions = require('firebase-functions');
const admin = require('firebase-admin');

var firebase = admin.database();


exports.function = "usuarios";
exports.api=[];


exports.api.push({
    "path":"/getUsuarios",
    "post":true,
    "handler":(req,res)=>{
        
        firebase.ref('usuarios').once('value').then((snapshot)=>{
            if(snapshot.val()){

                var dataReturn = [];

                Object.keys(snapshot.val()).forEach((value)=>{
                    var datatoAdd = {
                            id: value,
                            data : snapshot.val()[value]
                    }

                    dataReturn.push(datatoAdd)
                });


                res.status(200).send(dataReturn);
            }else{
                res.status(404).send("No se encontrarón usuarios.");
            }
        });
    }
});


exports.api.push({
    "path":"/getUsuario",
    "post":true,
    "handler":(req,res)=>{
        var id = req.body.id;


        firebase.ref(`usuarios/${id}`).once('value').then((snapshot)=>{
            if(snapshot.val()){
                res.status(200).send(snapshot.val());
            }else{
                res.status(404).send("No se encontrarón el usuario.");
            }
        });
    }
});


exports.api.push({
    "path":"/addUsuario",
    "post":true,
    "handler":(req,res)=>{
        var data = req.body.data;
        var key = firebase.ref('usuarios').push().key;
        var fecha = getFecha();
        data.creacion.fecha = fecha.fecha;
        data.creacion.timeStamp = fecha.timeStamp;
        data.creacion.lastDateModified = fecha.timeStamp;


        if(data.permisos){
            data.permisos.w = data.permisos.w==="true"? true:false;
            data.permisos.r = data.permisos.r==="true"? true:false;
            data.permisos.d = data.permisos.d==="true"? true:false;
        }

        firebase.ref('usuarios').orderByChild("correo").equalTo(`${data.correo}`).once('value',valor => {
            if(valor.val()){
                res.status(500).send({error:"El usuario ya se encuentra registrado."});
            }else{
                
                firebase.ref(`usuarios/${key}`).set(data,(err)=>{
                    
                    if(err === null){
                        res.status(200).send({error:false,texto:"Usuario agregado."});
                    }else{
                        res.status(500).send({error:"Ocurrio un error al guardar el usuario."});
                    }
                });
            }
        });
       
        
            
    }
});

exports.api.push({
    "path":"/updateUsuario",
    "post":true,
    "handler":(req,res)=>{

        var data = req.body.data;
        var id = req.body.id;

        var fecha = getFecha();
        data.creacion.lastDateModified = fecha.timeStamp;
        data.creacion.timeStamp = Math.abs(data.creacion.timeStamp);
        
        if(data.permisos){
            data.permisos.w = data.permisos.w==="true"? true:false;
            data.permisos.r = data.permisos.r==="true"? true:false;
            data.permisos.d = data.permisos.d==="true"? true:false;
        }
        var updates = {};
        

        updates[`usuarios/${id}`]= data;

        firebase.ref().update(updates).then(()=>{
            res.status(200).send({error:false,texto:"Usuario Guardado."});
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({error:"Ocurrio un error al guardar el usuario."});
        })
            
    }
});



exports.api.push({
    "path":"/delUsuario",
    "post":true,
    "handler":(req,res)=>{
        var id = req.body.id;

        firebase.ref(`usuarios/${id}`).remove((error)=>{
            if(error !== null){
                res.status(500).send({error:`No se elimino el usuario con id ${id}`});
            }else{
                res.status(200).send({error:false,texto:`Se elimino el usuario con id ${id}`});
            }
        })
    }
});


function getFecha(){
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var year = d.getFullYear();
    
    if(month < 10){
        month = "0"+month;
    }
    
    if(day < 10){
        day = "0"+day;
    }
 
    var fecha = {
        timeStamp:d.getTime(),
        fecha:day + "/"+month+"/"+year
    }

    return fecha;
}