var exports = module.exports = {};
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

/*var firestore = admin.firestore();

var collection = firestore.collection('contenidos');*/

var firebase = admin.database();


exports.function = "contenidos";
exports.api=[];


exports.api.push({
    "path":"/getContenidos",
    "post":true,
    "handler":(req,res)=>{
        
        firebase.ref('articulos').once('value').then((snapshot)=>{
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
                res.status(404).send("No se encontrarón artículos.");
            }
        });
    }
});


exports.api.push({
    "path":"/getContenidosFecha",
    "post":true,
    "handler":(req,res)=>{
        
        var fecha = req.body.fch;

       var fechaFin = getFin(fecha);
        
        var fechaInit = new Date(fecha).getTime();

        console.log(`FECHA INIT ${fechaInit}`)

        firebase.ref('articulos').orderByChild("publicacionTimeStamp").startAt(fechaInit).endAt(fechaFin).once('value').then((snapshot)=>{
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
                res.status(404).send("No se encontrarón artículos.");
            }
        });
    }
});

exports.api.push({
    "path":"/getContenido",
    "post":true,
    "handler":(req,res)=>{
        var id = req.body.id;


        firebase.ref(`articulos/${id}`).once('value').then((snapshot)=>{
            if(snapshot.val()){
                res.status(200).send(snapshot.val());
            }else{
                res.status(404).send("No se encontrarón el artículo.");
            }
        });
    }
});


exports.api.push({
    "path":"/addContenido",
    "post":true,
    "handler":(req,res)=>{
        var data = req.body.data;

        var key = firebase.ref('articulos').push().key;

        var fecha = getFecha();

        data.creacion.fecha = fecha.fecha;
        data.creacion.timeStamp = fecha.timeStamp;
        data.publicacionTimeStamp = new Date(data.publicacion).getTime();

        if(data.favorito){
            data.favorito = data.favorito === "true" ? true: false;
        }


        var anio = new Date(data.publicacion).getFullYear();
        firebase.ref('anios').orderByChild("anio").equalTo(anio).once('value',valor => {
                if(valor.val()){
                    console.log(`${anio} ya se encuentra registrado.`);
                }else{
                    var keyAnio = firebase.ref('anios').push().key;

                    firebase.ref(`anios/${keyAnio}`).set({anio:anio},(err)=>{
                        if(err === null){
                            console.log(`Se agrega el año ${anio}.`);
                        }
                    });

                    
                }
        });

        firebase.ref(`articulos/${key}`).set(data,(err)=>{

            if(err === null){
                res.status(200).send({error:false,texto:"Artículo Guardado."});
            }else{
                res.status(500).send({error:"Ocurrio un error al guardar el artículo."});
            }
        });
            
    }
});

exports.api.push({
    "path":"/updateContenido",
    "post":true,
    "handler":(req,res)=>{

        var data = req.body.data;
        var id = req.body.id;

        var fecha = getFecha();

        data.creacion.fecha = fecha.fecha;
        data.creacion.timeStamp = fecha.timeStamp;

        data.publicacionTimeStamp = new Date(data.publicacion).getTime();

        if(data.favorito){
            data.favorito = data.favorito === "true" ? true: false;
        }
        var updates = {};

        updates[`articulos/${id}`]= data;

        firebase.ref().update(updates).then(()=>{
            res.status(200).send({error:false,texto:"Artículo Guardado."});
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({error:"Ocurrio un error al guardar el artículo."});
        })
            
    }
});



exports.api.push({
    "path":"/delContenido",
    "post":true,
    "handler":(req,res)=>{
        var id = req.body.id;


        firebase.ref(`articulos/${id}`).remove((error)=>{
            if(error !== null){
                res.status(500).send({error:`No se elimino el artículo con id ${id}`});
            }else{
                res.status(200).send({error:false,texto:`Se elimino el artículo con id ${id}`});
            }
        })
    }
});


exports.api.push({
    "path":"/getLastsContenidos",
    "post":true,
    "handler":(req,res)=>{

        var limite = req.body.limite;
        
        firebase.ref('articulos').orderByChild("publicacionTimeStamp").limitToLast(limite).once('value').then((snapshot)=>{
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
                res.status(404).send("No se encontrarón artículos.");
            }
        });
    }
});

exports.api.push({
    "path":"/getLastFavoritos",
    "post":true,
    "handler":(req,res)=>{

        var limite = req.body.limite;
        
        firebase.ref('articulos').orderByChild("favorito").limitToLast(limite).once('value').then((snapshot)=>{
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
                res.status(404).send("No se encontrarón artículos.");
            }
        });
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



function getFin(fecha){
    var splitFecha = fecha.split("-");
    var mes = Math.abs(splitFecha[1]);
    var dias = "";
    switch(mes){
        case 1:
            dias=31;
            break;
        case 2:
            dias=29;
            break;
        case 3:
            dias=31;
            break;
        case 4:
            dias=30;
            break;
        case 5:
            dias=31;
            break;
        case 6:
            dias=30;
            break;
        case 7:
            dias=31;
            break;
        case 8:
            dias=31;
            break;
        case 9:
            dias=30;
            break;
        case 10:
            dias=31;
            break;
        case 11:
            dias=30;
            break;
        case 12:
            dias=31;
            break;
        default:
            dias=31;
    }

    var fechaFin = `${fecha}-${dias}`;
   

    var result = new Date(fechaFin).getTime();

    console.log(`FECHA FIN ${result}`)
    return result;
}