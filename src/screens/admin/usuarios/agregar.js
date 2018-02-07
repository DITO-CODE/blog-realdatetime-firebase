import React,{Component} from 'react';
import * as firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addUsuario,delUsuario} from '../../../reducer/usuarios'


/*
    Este componente es para editar o agregar usuarios podiendo asignar permisos
    w - agregar, r-lectura y edicion, d - Eliminar
*/

class UsuarioForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            correo:"",
            texto:"",
            fchPubli:"",
            mensajes:{},
            classBotones:"col-md-6 col-sm-3 col-xs-3",
            classBtnCancel :"text-left",
            contador:0,
            advertencia:false,
            disableButton:false,
            permisos:{
                w:true,
                r:true,
                d:true
            }

        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.usuarioAdded){
            debugger;
            this.setState({agregado:true,textoGuardado:nextProps.usuarioAdded.texto,disableButton:true});
        }

        if(nextProps.failAddedUser){
            var mensajes = this.state.mensajes;
            mensajes.correo = nextProps.failAddedUser.error;
            this.setState({mensajes});
        }

        if(nextProps.usuarioDeleted){
            this.setState({agregado:true,textoGuardado:nextProps.usuarioDeleted.texto,disableButton:true});  
        }
    }



    componentDidMount(){

        this.setState({user:this.props.user});
     
        if(this.props.usuario){
            this.setState({
                correo:this.props.usuario.data.correo,
                permisos:this.props.usuario.data.permisos,
                classBotones:"col-md-3 col-sm-3 col-xs-3",
                classBtnCancel :"text-center",
                creacion: this.props.usuario.data.creacion
            })

            this.listenerFirebase(this.props.usuario.id,this.state.contador);
        }
    }

    listenerFirebase(id,contador){

            firebase.database().ref(`usuarios/${id}`).on("value",data => {
                if(data.val()){
                    var usuario = data.val();
                    this.setState({advertencia:`El usuario ${usuario.creacion.lastUserModified} acaba de modificar este usuario. `,
                                    usuarioModficador:usuario.creacion.lastUserModified,contador:contador++,
                                    newData:data.val(),agregado:false,disableButton:false});
                }
            },(error)=>{

            });
        
    }

    mergeData(event){
        var data = this.state.newData
        this.setState({
            correo:data.correo,
            permisos:data.permisos,
            creacion:data.creacion,
            agregado:false,
            advertencia:false
        })
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
                                       {`${this.props.accion.toUpperCase()} USUARIO`}
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

                                    {
                                        this.state.advertencia && this.state.usuarioModficador !== this.state.user.email
                                        && this.state.contador>0
                                        ? 
                                            <div className="col-md-12">
                                                <div className="alert alert-warning">
                                                    <strong>Éxito! </strong> {this.state.advertencia}
                                                    <button onClick={this.mergeData.bind(this)} className="btn btn-primary btn-sm" > Aplicar Cambios </button>
                                                    <span className="glyphicon glyphicon-remove advertencia" onClick={this.removeAdvertencia.bind(this)}></span>
                                                </div>
                                            </div>
                                        : null
                                    }
                                    


                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="correo">Correo:</label>
                                            <input type="text" className="form-control" id="correo"  name="correo"
                                            value={this.state.correo}
                                            onChange={this.changeValues.bind(this)}/>
                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.correo ?
                                                     <p className="errorMsj">{this.state.mensajes.correo}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>


                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="correo">Permisos:</label>
                                        </div>
                                    </div>


                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label htmlFor="correo">
                                                Agregar: <input type="checkbox" value="w" 
                                                checked={this.state.permisos.w}
                                                onChange={this.changeValues.bind(this)}
                                                />  <span className="glyphicon glyphicon-plus"></span>
                                            </label>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="correo">
                                                Editar: <input type="checkbox" value="r" 
                                                     checked={this.state.permisos.r}
                                                     onChange={this.changeValues.bind(this)}
                                                /> <span className="glyphicon glyphicon-edit"></span>
                                            </label>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="correo">
                                                Eliminar: <input type="checkbox" value="d" 
                                                 checked={this.state.permisos.d}
                                                 onChange={this.changeValues.bind(this)}
                                                /> <span className="glyphicon glyphicon-trash"></span>
                                            </label>
                                        </div>
                                    </div>


                                    <div className="col-md-12">
                                        <div className={`${this.state.classBotones} text-right`}>
                                            <button className="btn btn-primary btn-sm" onClick={this.guardar.bind(this) }
                                                disabled={this.state.disableButton}
                                            >
                                                <span className="glyphicon glyphicon-floppy-disk"></span> Guardar
                                            </button>
                                        </div>
                                        <div className={`${this.state.classBotones} ${this.state.classBtnCancel}`}>
                                            <button className="btn btn-warning btn-sm" onClick={this.props.regresar }>
                                                <span className="glyphicon glyphicon-remove"></span> Cancelar
                                            </button>
                                        </div>
                                        {
                                            this.props.accion === "editar" ? 
                                                <div className={`${this.state.classBotones} text-left`}>
                                                    <button className="btn btn-danger btn-sm" onClick={this.eliminar.bind(this) }>
                                                        <span className="glyphicon glyphicon-trash"></span> Eliminar
                                                    </button>
                                                </div>
                                            :null
                                        }
                                    </div>

                                </div>            

                            </div>
                        </div>
                    </div>
            </div>
        )
    }


    removeAdvertencia(event){
        this.setState({advertencia:null});
    }

    removeAgregado(event){
        this.setState({agregado:false});
    }

    guardar(event){

        var values = {}
        var mensajes = this.state.mensajes;
        var valido = true;

       

        if(this.state.correo.trim() === ""){
            valido = false;
            mensajes.correo = "Campo requerido."
        }else{
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(this.state.correo)){
                valido = false;
                mensajes.correo = "Capture un correo válido."
            }
        }


        
        values = {
            data:{
                correo: this.state.correo,
                permisos:this.state.permisos
                    
            }
        }

        this.setState({mensajes});
        if(valido){

            debugger;
            if(this.props.accion === "editar"){
                values.id =  this.props.usuario.id;
                var creacion = this.state.creacion;

                creacion.lastUserModified = this.props.user.email;
                values.data.creacion = creacion;
               
            }else{
                values.data.creacion = {
                    userAdded: this.props.user.email,
                    lastUserModified:this.props.user.email
                }
            }

            this.props.actions.addUsuario(values);
        }

        

    }

    eliminar(event){
        var values = {
            id : this.props.usuario.id
        }
        this.props.actions.delUsuario(values);
    }

    changeValues(event){
        var name = event.target.name;
        var value = event.target.value;
        var mensajes = this.state.mensajes;
        var permisos = this.state.permisos;
    
        if(event.target.type === "checkbox"){
            permisos[value] = event.target.checked;
        }
        
        mensajes[name]=null;
        this.setState({[name]:value,mensajes,permisos});
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
  )(UsuarioForm);