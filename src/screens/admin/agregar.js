import React,{Component} from 'react';
import * as firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addContenido,delContenido} from '../../reducer/contenidos'
import  CKEditor from 'react-ckeditor-wrapper';

class ArticuloForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            titulo:"",
            texto:"",
            fchPubli:"",
            mensajes:{},
            classBotones:"col-md-6 col-sm-3 col-xs-3",
            classBtnCancel :"text-left",
            contador:0,
            advertencia:false,
            disableButton:false,
            content: 'content'
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.contenidoAdded){
            debugger;
            this.setState({agregado:true,textoGuardado:nextProps.contenidoAdded.texto,disableButton:true});
        }

        if(nextProps.contenidoDeleted){
            this.setState({agregado:true,textoGuardado:nextProps.contenidoDeleted.texto,disableButton:true});  
        }
    }


    componentDidMount(){

        this.setState({user:this.props.user});
     
        if(this.props.articulo){
            var data = this.props.articulo.data;
            this.setState({
                titulo:data.titulo,
                texto:data.contenido.texto,
                fchPubli:data.publicacion,
                classBotones:"col-md-3 col-sm-3 col-xs-3",
                classBtnCancel :"text-center"
            })

            this.listenerFirebase(this.props.articulo.id,this.state.contador);
        }
    }

    listenerFirebase(id,contador){

            firebase.database().ref(`articulos/${id}`).on("value",data => {
                if(data.val()){
                    var articulo = data.val();
                    this.setState({advertencia:`El usuario ${articulo.creacion.creador} acaba de modificar este artículo. `,
                                    usuarioModficador:articulo.creacion.creador,contador:contador++,
                                    newData:data.val(),agregado:false,disableButton:false});
                }
            },(error)=>{

            });
        
    }

    mergeData(event){
        var data = this.state.newData
     
        this.setState({
            titulo:data.titulo,
            texto:data.contenido.texto,
            fchPubli:data.publicacion,
            agregado:false,
            advertencia:false
        })
    }

    updateContent(value) {
        var mensajes = this.state.mensajes;
        mensajes.texto = null;
        this.setState({texto:value,mensajes})
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
                                       {`${this.props.accion.toUpperCase()} ARTÍCULO`}
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
                                            <label htmlFor="titulo">Título:</label>
                                            <input type="text" className="form-control" id="titulo"  name="titulo"
                                            value={this.state.titulo}
                                            onChange={this.changeValues.bind(this)}/>
                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.titulo ?
                                                     <p className="errorMsj">{this.state.mensajes.titulo}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="fchPubli">Fecha de publicación:</label>
                                            <input type="date" className="form-control" id="fchPubli"  name="fchPubli"
                                            value={this.state.fchPubli}
                                            onChange={this.changeValues.bind(this)}/>
                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.fchPubli ?
                                                     <p className="errorMsj">{this.state.mensajes.fchPubli}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-12 editor">
                                        
                                      
                                            <CKEditor 
                                                value={this.state.texto} 
                                                onChange={this.updateContent.bind(this)} />
                                                 {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.texto ?
                                                     <p className="errorMsj">{this.state.mensajes.texto}</p> 
                                                     :null
                                                :null
                                            }
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

        debugger;
        var values = {}
        var mensajes = this.state.mensajes;
        var valido = true;

       

        if(this.state.titulo.trim() === ""){
            valido = false;
            mensajes.titulo = "Campo requerido."
        }


        if(this.state.texto.trim() === "" || this.state.texto.trim() === "<p></p>"){
            valido = false;
            mensajes.texto = "Campo requerido."
        }

        if(this.state.fchPubli.trim() === ""){
            valido = false;
            mensajes.fchPubli = "Campo requerido."
        }

        
            values = {
                data:{
                    titulo: this.state.titulo,
                    contenido : {
                        imgUrl:"www.google.com",
                        texto: this.state.texto
                    },
                    creacion:{
                        creador: this.props.user.email
                    },
                    publicacion:this.state.fchPubli
                        
                }
            }

        this.setState({mensajes});
        if(valido){

            debugger;
            if(this.props.accion === "editar"){
                values.id =  this.props.articulo.id;
            }

            this.props.actions.addContenido(values);
        }

        

    }

    eliminar(event){
        var values = {
            id : this.props.articulo.id
        }
        this.props.actions.delContenido(values);
    }

    changeValues(event){
        var name = event.target.name;
        var value = event.target.value;
        var mensajes = this.state.mensajes;
    
        
                mensajes[name]=null;
        this.setState({[name]:value,mensajes});
    }
}

const mapStateToProps = (state) => {
    return {
        contenidoAdded: state.contenidos.get("contenidoAdded"),
        contenidoDeleted:  state.contenidos.get("contenidoDeleted")

    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({addContenido,delContenido }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticuloForm);