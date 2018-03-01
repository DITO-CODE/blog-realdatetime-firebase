import React,{Component} from 'react';
import * as firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import ArticuloForm from './agregar';
import AdminUsers from './adminUsuarios';
import UsuariosSuscritos from './usuariosEnvio';
import Banners from './banners';
import {getContenidos} from '../../reducer/contenidos'


class AdminPanel extends Component {

    constructor(props){
        super(props);
        this.state={
            titulo:"ADMINISTRACIÓN DE ARTÍCULOS",
            fechaBusqueda:"",
            articuloForm:false,
            anios:[],
            mes: "01",
            anio:new Date().getFullYear()
        };
    }

    componentDidMount(){

       this.loadAnios();
    }

    render(){
        if(this.state.articuloForm){
            return <ArticuloForm  
                user={this.props.user}
                regresar={this.regresar.bind(this)} accion={this.state.accion} articulo={this.state.articulo}/>
        }

        if(this.state.usuarios){
            return <AdminUsers  
            user={this.props.user}
            regresar={this.regresar.bind(this)}/>
        }

        if(this.state.banners){
            return <Banners user={this.props.user} regresar={this.regresar.bind(this)} />
        }

        if(this.state.suscritos){
            return <UsuariosSuscritos user={this.props.user} regresar={this.regresar.bind(this)} />
        }

        return (
            <div className="backLogin">
                    <div className="row">
                        <div className="container">
                            <div className="col-md-12 panelAdmin">
                                <div className="col-md-12 text-center textoTiuloAdmin">
                                       {this.state.titulo}
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                    <button type="button" className="btn btn-danger btn-sm"
                                        onClick={this.agregar.bind(this)}
                                    >
                                        <span className="glyphicon glyphicon-list-alt"></span> Agregar
                                    </button>
                                    <button type="button" className="btn btn-success btn-sm"
                                        onClick={this.usuarios.bind(this)}
                                    >
                                        <span className="glyphicon glyphicon-user"></span> Usuarios
                                    </button>

                                    <button type="button" className="btn btn-warning btn-sm"
                                        onClick={this.banners.bind(this)}
                                    >
                                        <span className="glyphicon glyphicon-th-large"></span> Banners
                                    </button>

                                    <button type="button" className="btn btn-warning btn-sm"
                                        onClick={this.suscritos.bind(this)}
                                    >
                                        <span className="glyphicon glyphicon-list-alt"></span> Suscritos
                                    </button>
                                   
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-6 text-right ">
                                    <select id="mes" name="mes" value={this.state.mes} onChange={this.changeValues.bind(this)}>
                                        <option value="01">Ene</option>
                                        <option value="02">Feb</option>
                                        <option value="03">Mar</option>
                                        <option value="04">Abr</option>
                                        <option value="05">May</option>
                                        <option value="06">Jun</option>
                                        <option value="07">Jul</option>
                                        <option value="08">Ago</option>
                                        <option value="09">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dic</option>
                                    </select>
                                    <select id="anio" name="anio" value={this.state.anio} onChange={this.changeValues.bind(this)}>
                                        {
                                            this.state.anios.length > 0 ?
                                              this.state.anios.map((value,index)=> {
                                                return <option key={index} value={value} > {value} </option>
                                              }) : null
                                        }
                                    </select>
                                    
                                    <button className="btn btn-default btn-sm btnBuscar" onClick={this.buscarContenidos.bind(this) }>
                                        <span className="glyphicon glyphicon-search"></span>
                                    </button>
                                </div>

                                {
                                    this.props.contenidos ?
                                        <div className="col-md-12 text-center tablaArticulos">
                                            <ReactTable
                                                resizable= {true}
                                                data={this.props.contenidos}
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
                                                        Header: "Id",
                                                        accessor: "id",
                                                        show:false,
                                                        filterable:false,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "TÍTULO",
                                                        accessor: "data.titulo",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "CREADO",
                                                        accessor: "data.creacion.fecha",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "CREADOR",
                                                        accessor: "data.creacion.creador",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "FAVORITO",
                                                        accessor: "data.favorito",
                                                        show:true,
                                                        filterable:false,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {

                                                                props.value ? 
                                                                <span className="glyphicon glyphicon-star favoritoSelect"></span>
                                                                : <span className="glyphicon glyphicon-star-empty"></span>
                                                            }
                                                        </div>
                                                    },
                                                    {
                                                        Header: "EDITAR",
                                                        accessor: "",
                                                        show:true,
                                                        filterable:false,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            <button type="button" className="btn btn-primary btn-sm"
                                                                onClick={this.editar.bind(this,props.value)}
                                                            >
                                                                <span className="glyphicon glyphicon-edit"></span> Editar
                                                            </button>
                                                        </div>
                                                    }
                                                ]}
                                                width= "auto"
                                                filterable
                                                />
                                        </div>
                                    : null

                                }

                                {
                                    this.props.failGetContenidos ? 
                                     
                                            <div className="col-md-12">
                                                <div className="alert alert-warning alertaContenido">
                                                    {this.props.failGetContenidos.error}
                                                </div>
                                            </div>
                                        : null
                                    
                                }

                                {
                                    this.state.anios.length === 0 ? 
                                     
                                            <div className="col-md-12">
                                                <div className="alert alert-warning alertaContenido">
                                                  <span className="glyphicon glyphicon-arrow-up">
                                                  </span> Aun no se tienen registros agrega alguno.
                                                </div>
                                            </div>
                                        : null
                                    
                                }

                            </div>
                        </div>
                    </div>
            </div>
        )
    }

    buscarContenidos(event){
        var values = {
            fch:`${this.state.anio}-${this.state.mes}`
        }
       this.props.actions.getContenidos(values);
    }

    changeValues(event){
        //var type = event.target.type;
        var name = event.target.name;

        this.setState({[name]:event.target.value});
        
    }

    agregar(event){
        this.setState({articuloForm:true,accion:"agregar"});
    }

    editar(values,event){
        this.setState({articuloForm:true,accion:"editar",articulo:values});
    }

    regresar(event){
        this.setState({articuloForm:false,articulo:null,usuarios:false,banners:false,suscritos:false},()=>{
            this.loadAnios();
            this.buscarContenidos();
        });
    }

    loadAnios(){
        firebase.database().ref('anios').orderByChild("anio").once('value',data => {
            if(data.val()){
                var anios = this.state.anios;
                Object.keys(data.val()).forEach((element)=>{
                    anios.push(data.val()[element].anio); 
                });

                this.setState({anios:anios})
            }
        });
    }

    usuarios(event){
        this.setState({usuarios:true});
    }

    banners(event){
        this.setState({banners:true});
    }

    suscritos(event){
        this.setState({suscritos:true})
    }
}

const mapStateToProps = (state) => {
    return {
        contenidos: state.contenidos.get("contenidos"),
        failGetContenidos : state.contenidos.get("failGetContenidos")
    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getContenidos }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminPanel);