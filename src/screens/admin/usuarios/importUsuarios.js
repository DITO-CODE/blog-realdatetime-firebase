import React,{Component} from 'react';
import * as firebase from 'firebase';
import $ from 'jquery';
import { urls } from '../../../properties/functionsUrl';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addUsuario,delUsuario} from '../../../reducer/usuarios'
import 'react-table/react-table.css';
import ReactTable from 'react-table';

class ImportUsuarios extends Component {

    constructor(props){
        super(props);
        this.state = {
            mensajes:{},
            classBotones:"col-md-6 col-sm-3 col-xs-3",
            classBtnCancel :"text-left",
            advertencia:false,
            disableButton:false,
            porcentajeProceso:0

        }

    }


    componentDidMount(){
        this.setState({user:this.props.user});
    }


    render(){
        return(
            <div className="backLogin">
                    <div className="row">
                        <div className="container">
                            <div className="col-md-12 panelAdmin">
                                <div className="btnRegresar">
                                    <span className="glyphicon glyphicon-chevron-left" onClick={this.props.regresar}></span>
                                </div>
                                <div className="col-md-12 text-center textoTiuloAdmin">
                                      AGREGAR USUARIOS A NEWSLETTER
                                </div>

                                <div className="col-md-12 formAgregar">
                                    {
                                        this.state.agregado ? 
                                            <div className="col-md-12">
                                                <div className="alert alert-success">
                                                    <strong>Éxito! </strong> {this.state.textoGuardado}   
                                                    <span className="glyphicon glyphicon-remove advertencia" onClick={this.removeAgregado.bind(this)}></span>
                                                </div>
                                            </div> 
                                        : null

                                    }



                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="correo">Archivo CVS:</label>
                                            <input type="file" className="form-control" id="correo"  name="correo"
                                            onChange={this.changeValues.bind(this)}/>
                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.archivo ?
                                                     <p className="errorMsj">{this.state.mensajes.archivo}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>

                                   

                                    {
                                        this.state.procesando ? 
                                        <div className="col-md-12">
                                            <span>PROCESANDO...</span>
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{width:`${this.state.porcentajeProceso}%`}}>
                                                    <span className="sr-only">{this.state.porcentajeProceso}% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                         : 

                                        <div className="col-md-12">
                                        <div className={`${this.state.classBotones} text-right`}>
                                            <button className="btn btn-primary btn-sm" onClick={this.guardar.bind(this) }
                                                disabled={this.state.disableButton}
                                            >
                                                <span className="glyphicon glyphicon-floppy-disk"></span> Procesar
                                            </button>
                                        </div>
                                        <div className={`${this.state.classBotones} ${this.state.classBtnCancel}`}>
                                            <button className="btn btn-warning btn-sm" onClick={this.props.regresar }>
                                                <span className="glyphicon glyphicon-remove"></span> Cancelar
                                            </button>
                                        </div>
                                    </div>
                                    }

                                    {
                                       this.state.invalidos ? 
                                       <div className="col-md-12 text-center tablaArticulos">
                                       <ReactTable
                                           resizable= {true}
                                           data={this.state.invalidos}
                                           minRows= {1}
                                           defaultPageSize={10}
                                           previousText= {'Anterior'}
                                           nextText= 'Siguiente'
                                           loadingText= 'Cargando...'
                                           noDataText= ''
                                           pageText= 'Página'
                                           ofText= 'de'
                                           rowsText = 'filas'
                                           showPageSizeOptions = {false}
                                           columns={[
                                               {
                                                   Header: "Correo",
                                                   accessor: "email",
                                                   show:true,
                                                   Cell: props => 
                                                   <div className="text-center">
                                                       {props.value}
                                                   </div>
                                               },
                                               {
                                                   Header: "Nombre",
                                                   accessor: "nombre",
                                                   show:true,
                                                   Cell: props => 
                                                   <div className="text-center">
                                                       {props.value}
                                                   </div>
                                               },
                                               {
                                                Header: "Razon",
                                                accessor: "razon",
                                                show:true,
                                                Cell: props => 
                                                <div className="text-center">
                                                    {props.value}
                                                </div>
                                                },

                                           ]}
                                           width= "auto"
                                           filterable
                                           />
                                           </div> 
                                       
                                       : null 
                                    }
                                    

                                </div>            

                            </div>
                        </div>
                    </div>
            </div>
        )
    }


    removeAgregado(event){
        this.setState({agregado:false});
    }

    guardar(event){

        var mensajes = this.state.mensajes;
        var valido = true;

        if(!this.state.archivo){
            mensajes.archivo = "Campo requerido.";
            valido= false;
        }


        this.setState({mensajes});
        if(valido){

            this.setState({procesando:true});
            var reader = new FileReader();
            var file = this.state.file;
            reader.onload = this.readerCvs.bind(this);
            reader.readAsText(file);
    
          
        }

        

    }

    readerCvs(event){
        try{
            var valores = event.target.result.split(/\r\n|\n/);

            var campos = valores[0].split(",");
            var valoresReales = valores.splice(0,1);
            //Creamos los objetos a JSON
            var valoresJSON = [];
            
            var $_this = this;
            $.each(valores,(index,value)=>{
                //console.log(value);
                if(value.trim() !== ""){
                    var objJson = {};
                    var valor = value.split(",");
                    $.each(campos,(indexC,valueC)=>{

                        if(valueC.includes(".")){
                            var campo = valueC.split(".");
                            
                            if(objJson[campo[0]]){
                                //ya existe la propiedad
                                var propiedad = objJson[campo[0]];
                                propiedad[campo[1]]=valor[indexC]

                                objJson[campo[0]] = propiedad;
                            }else{
                                objJson[campo[0]] = {[campo[1]]:valor[indexC]}
                            }

                        }else{
                            objJson[valueC]=valor[indexC];
                        }
                    });

                    valoresJSON.push(objJson);
                }
            });
            this.importData(valoresJSON);
        }catch(error){
            alert("Formato cvs incorrecto");
        }
    }   

    importData(jsonData){
        var $_this  = this;
        var total = jsonData.length;  
        var invalidos=[];      
        for(var i=1; i <= jsonData.length ; i++){
            var usuario = jsonData[i-1];
            console.log(usuario);
            var porcentaje = (i/total)*100;
            this.setState({porcentajeProceso:porcentaje,estiloPorcensaje:`width:${porcentaje}%`});


            if(usuario.nombre && usuario.email){
                var usuarioValido = true;
                var razonInvalido = {};
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(usuario.email)){
                    usuarioValido=false;
                    razonInvalido={
                        nombre:usuario.nombre,
                        email:usuario.email,
                        razon:"Correo incorrecto."
                    }
                }

                if(usuario.nombre.trim() === ""){
                    usuarioValido=false;
                    razonInvalido={
                        nombre:usuario.nombre,
                        email:usuario.email,
                        razon:"Nombre incorrecto."
                    }
                }

                if(usuarioValido){
                    var values = {
                        nombre:usuario.nombre,
                        email:usuario.email
                    };

                    this.suscribeUsuario(values);

                }else{
                    invalidos.push(razonInvalido);
                }

                if(porcentaje===100){
                    this.setState({invalidos,procesando:false});
                }
            }
        }
    }

    changeValues(event){
        var name = event.target.name;
        var value = event.target.value;
        var mensajes = this.state.mensajes;

        var archivo = false;
        if(event.target.type === "file"){
            
            if(event.target.files.length > 0){
                var name = event.target.files[0].name;
                var nameSplit  = name.split(".");
                
                
                if(nameSplit.length > 0){
                    var extension = nameSplit[nameSplit.length-1].toUpperCase();
                    if(extension === "CSV"){
                        archivo = true;
                        this.setState({tipo:extension,file:event.target.files[0],error:null})
                        
                    }else{
                        mensajes.archivo="Solo se permiten archivos con extension csv.";
                        this.setState({tipo:extension,file:null,error:null})
                    }
                }else{
                    mensajes.archivo="Ingrese un archivo valido.";
                    this.setState({tipo:extension,file:null,error:null})
                }
            }
        }
        
        mensajes[name]=null;
        this.setState({mensajes,archivo});
    }


    suscribeUsuario(values){


       return new Promise((resolve,reject)=>{
            $.ajax({
                url: urls().SUSCRIPCIONUSUSARIO,
                type: "POST",
                dataType: 'json',
                data:  values,
                success: function(data,status,req){
                    resolve(data);
                },
                error: function(data,status,req){
                    debugger;
                    if(data.status === 404){
                        reject({error:"Usuario Suscrito"});
                    }else{
                        reject({error:"No se "});
                    }
                    
                }
            });
        });
    }
}

const mapStateToProps = (state) => {
    return {
        usuarioAdded: state.usuarios.get("usuarioAdded"),
        usuarioDeleted:  state.usuarios.get("usuarioDeleted"),
        failAddedUser : state.usuarios.get("failAddedUser")

    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({addUsuario,delUsuario }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ImportUsuarios);