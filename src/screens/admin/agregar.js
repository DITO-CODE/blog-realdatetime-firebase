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
            content: 'content',
            classFavorito: "glyphicon-star-empty",
            imagenToStorage:false,
            imagenToStorageSlider:false,
            favorito:false
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.contenidoAdded){
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
                nameFile:data.contenido.nameFile,
                nameFileSlider: data.contenido.nameFileSlider,
                classBotones:"col-md-3 col-sm-3 col-xs-3",
                classBtnCancel :"text-center",
                favorito:data.favorito ? data.favorito : false,
                classFavorito: data.favorito ? "glyphicon-star favoritoSelect" :"glyphicon-star-empty"
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
                                    <div className="col-md-12 editor">
                                        <div className="form-group">
                                            <label htmlFor="fchPubli">Imagen:</label>
                                            <input type="file" className="form-control" id="imagen"  name="imagen"
                                            value={this.state.imagen}
                                            onChange={this.changeValues.bind(this)} />

                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.imagen ?
                                                     <p className="errorMsj">{this.state.mensajes.imagen}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-12 editor">
                                        <div className="form-group">
                                            <label htmlFor="fchPubli">Imagen Slider:</label>
                                            <input type="file" className="form-control" id="imagenSlider"  name="imagenSlider"
                                            value={this.state.imagenSlider}
                                            onChange={this.changeValues.bind(this)} />

                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.imagenSlider ?
                                                     <p className="errorMsj">{this.state.mensajes.imagenSlider}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>


                                    <div className="col-md-12 editor">
                                        <div className="form-group">
                                            <label htmlFor="fchPubli">Cita:</label>
                                            <input type="text" className="form-control" id="cita"  name="cita"
                                            value={this.state.cita}
                                            onChange={this.changeValues.bind(this)} />

                                            {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.cita ?
                                                     <p className="errorMsj">{this.state.mensajes.cita}</p> 
                                                     :null
                                                :null
                                            }
                                        </div>
                                    </div>


                                    <div className="col-md-12 editor">
                                        <div className="form-group">
                                                <label htmlFor="fchPubli">Favorito:</label>
                                                <div className="favoritoContent">
                                                    <span className={`glyphicon ${this.state.classFavorito}`}
                                                    onClick={(event)=>{
                                                        if(this.state.favorito){
                                                            this.setState({favorito:false,classFavorito:"glyphicon-star-empty"})
                                                        }else{
                                                            this.setState({favorito:true,classFavorito:"glyphicon-star favoritoSelect"})
                                                        }
                                                        
                                                       
                                                        
                                                    }}
                                                    ></span>
                                                </div>
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

        if(!this.state.imagenToStorage){
            valido = false;
            mensajes.imagen = "Campo requerido."
        }

        if(!this.state.imagenToStorageSlider){
            valido = false;
            mensajes.imagenSlider = "Campo requerido."
        }

        
           

        this.setState({mensajes});
        if(valido){

            var storageRef = firebase.storage().ref(`img_contenidos/${this.state.nameFile}`);
            
            storageRef.put(this.state.imagenToStorage).then(snapshot =>{
                var storageRefSlider = firebase.storage().ref(`img_contenidos_slider/${this.state.nameFileSlider}`);
                storageRefSlider.put(this.state.imagenToStorageSlider).then(snapshotSlider =>{
                    console.log(snapshotSlider);  
                    console.log(this.state);
                    
                    values = {
                        data:{
                            titulo: this.state.titulo,
                            contenido : {
                                imgUrl:snapshot.downloadURL,
                                texto: this.state.texto,
                                nameFile:this.state.nameFile,
                                imgUrlSlider: snapshotSlider.downloadURL,
                                nameFileSlider: this.state.nameFileSlider,
                                cita: this.state.cita
                            },
                            creacion:{
                                creador: this.props.user.email
                            },
                            publicacion:this.state.fchPubli,
                            favorito:this.state.favorito
                                
                        }
                    }
                    
                    if(this.props.accion === "editar"){
                        values.id =  this.props.articulo.id;
                    }
                    
                    this.props.actions.addContenido(values);

                });


            });
           
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
        var type = event.target.type;

        if(type === "file"){
            var file = event.target.files[0];
            if(file){


                if(name === "imagen"){
                    if(this.state.nameFile){
                        var nameFile = this.state.nameFile;
                    }else{
                        var nameFile = this.getFileName(file.name);
                    }
                    mensajes.imagen=null;
                    this.setState({imagenToStorage:file,nameFile,mensajes});
                }else if(name === "imagenSlider"){
                    if(this.state.nameFileSlider){
                        var nameFileSlider = this.state.nameFileSlider;
                    }else{
                        var nameFileSlider = this.getFileName(file.name);
                    }
                    mensajes.imagenSlider=null;
                    this.setState({imagenToStorageSlider:file,nameFileSlider,mensajes});
                }
            }else{
                if(name === "imagen"){
                    this.setState({nameFile:"",imagenToStorage:false});
                }else if(name === "imagenSlider"){
                    this.setState({nameFileSlider:"",imagenToStorageSlider:false});
                }
            }
        }else{
            mensajes[name]=null;
            this.setState({[name]:value,mensajes});
        }
        
      
    }

    getFileName(fileName){
        var x = Math.floor((Math.random() * 20) + 1);
        var date = new Date();

        var nombre = fileName.split(".");

        var ext = nombre[nombre.length-1];
        

        var nombre = x.toString() + date.getTime().toString()+"."+ext;

        return nombre;

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