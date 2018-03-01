import React,{Component} from 'react';
import * as firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getContenidoId,getContenidos} from '../../reducer/contenidos'


class BannerContent extends Component{
    constructor(props){
        super(props);

        this.state = {
            editar:true,
            mensajes:{},
            articulo:"",
            imagenToStorage:false
        }
    }

    componentDidMount(){
        this.props.actions.getContenidos();
        if(this.props.data.data){
            console.log(this.props.data);
            this.setState({editar:false})

            var values = {
                id : this.props.data.data.contenido
            }
            this.props.actions.getContenidoId(values)
           

            this.setState({img:this.props.data.data.img,
                    contenido:this.props.data.data.contenido,
                    nameFile:this.props.data.data.nameFile,
                id:this.props.data.id})
        }
    }


    render(){
        return (
            <div className="col-sm-12 col-md-4">
                <div className="thumbnail">

                {
                   this.state.editar ? 
                   <div>
                        <div className="caption">
                                    <div className="form-group">
                                        <label htmlFor="imagen">Imagen:</label>
                                        <input type="file" className="form-control" id="imagen"  name="imagen"
                                        onChange={this.changeValues.bind(this)}
                                        />
                                          {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.imagen ?
                                                     <p className="errorMsj">{this.state.mensajes.imagen}</p> 
                                                     :null
                                                :null
                                            }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="articulo">Artículo:</label>
                                        <select className="form-control" id="articulo"  name="articulo" onChange={this.changeValues.bind(this)}>
                                            <option value=""> </option>

                                            {
                                                this.props.contenidos ? 
                                                 this.props.contenidos.map((value,index)=>{

                                                    return  <option key={index} value={value.id}>{value.data.titulo}</option>

                                                 }) : null
                                            }
                                        </select>
                                        {
                                                this.state.mensajes ? 
                                                    this.state.mensajes.articulo ?
                                                     <p className="errorMsj">{this.state.mensajes.articulo}</p> 
                                                     :null
                                                :null
                                            }
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary" onClick={this.guardar.bind(this)}>Guardar</button>

                                        {
                                            this.state.id ? <button className="btn btn-danger" 
                                                                onClick={this.cancelarEvent.bind(this)}>Cancelar</button> : null
                                        }
                                    </div>
                            </div>
                    </div>
              :
                        <div>
                            <img src={this.state.img} alt="..." />
                            <div className="caption">
                                <p><a className="btn btn-primary" role="button" onClick={this.editarEvent.bind(this,this.state.id)}>Editar</a> 
                                <a className="btn btn-default" role="button">{this.getNombreArticulo(this.state.contenido)}</a></p>
                            </div>
                        </div> 
                       
                }
                   
                </div>
            </div>
        )
    }

    getNombreArticulo(id){
        debugger;
        var titulo = id;
        if(this.props.contenidos){
            this.props.contenidos.forEach(element=>{
                if(id ===  element.id){
                    titulo = element.data.titulo;
                }
                
            });
        }

        return titulo;
    }

    editarEvent(id,event){
        this.setState({editar:true,editBanner:id});
    }

    cancelarEvent(event){
        this.setState({editar:false,editBanner:null});
    }

    changeValues(event){
        var name = event.target.name;
        var value = event.target.value;
        var mensajes = this.state.mensajes;
        var type = event.target.type;

        if(type === "file"){
            var file = event.target.files[0];

            if(file){
                if(this.state.nameFile){
                    var nameFile = this.state.nameFile;
                }else{
                    var nameFile = this.getFileName(file.name);
                }
              
                mensajes.imagen=null;
                this.setState({imagenToStorage:file,nameFile,mensajes});
            }else{
                this.setState({nameFile:"",imagenToStorage:false});
            }
        }else{
            mensajes[name]=null;
            this.setState({[name]:value,mensajes});
        }      
    }

    guardar(event){
        var mensajes = this.state.mensajes;
        var valido = true;
        if(this.state.articulo === ""){
            valido = false;
            mensajes.articulo="Campo requerido."
        }

        if(!this.state.imagenToStorage){
            valido = false;
            mensajes.imagen="Campo requerido."
        }

        this.setState({mensajes});
        if(valido){

            
            var storageRef = firebase.storage().ref(`img_banners/${this.state.nameFile}`);

            storageRef.put(this.state.imagenToStorage).then(snapshot =>{

                

                var values = {
                    contenido: this.state.articulo,
                    img: snapshot.downloadURL,
                    nameFile: this.state.nameFile
                }

               
                if(this.state.editBanner){
                    var updates = {};
                    
                    updates[`banners/${this.state.editBanner}`]= values;
            
                    firebase.database().ref().update(updates).then(()=>{
                        this.setState({img:values.img,contenido:values.contenido,editar:false,id:this.state.editBanner});
                    });

                }else{
                    var key = firebase.database().ref('banners').push().key;
                    firebase.database().ref(`banners/${key}`).set(values,(err)=>{
                        this.setState({img:values.img,contenido:values.contenido,editar:false,id:key});
                    });    
                }

            });;
           
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
        contenido: state.contenidos.get("contenido"),
        contenidos: state.contenidos.get("contenidos")
    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getContenidoId,getContenidos }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(BannerContent);