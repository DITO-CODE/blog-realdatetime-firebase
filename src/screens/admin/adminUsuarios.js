import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import {getUsuarios} from '../../reducer/usuarios'
import UsuarioForm from './usuarios/agregar';


class AdminUsers extends Component{

    constructor(props){
        super(props);
        this.state={
            titulo:"ADMINISTRACIÓN DE USUARIOS"
        };
    }

    componentDidMount(){
        this.props.actions.getUsuarios();
    }

    render(){

        if(this.state.usuarioForm){
            return <UsuarioForm  
                user={this.props.user}
                regresar={this.regresar.bind(this)} accion={this.state.accion} usuario={this.state.usuario} />
        }

        return(
            <div className="backLogin">
                    <div className="row">
                        <div className="container">
                            <div className="col-md-12 panelAdmin">
                            <div className="btnRegresar">
                                    <span className="glyphicon glyphicon-chevron-left" onClick={this.props.regresar}></span>
                                </div>
                                <div className="col-md-12 text-center textoTiuloAdmin">
                                       {this.state.titulo}
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-12 text-left">
                                    <button type="button" className="btn btn-danger btn-sm"
                                        onClick={this.agregar.bind(this)}
                                    >
                                        <span className="glyphicon glyphicon-list-alt"></span> Agregar
                                    </button>
                                </div>

                                {
                                    this.props.usuarios ?
                                        <div className="col-md-12 text-center tablaArticulos">
                                            <ReactTable
                                                resizable= {true}
                                                data={this.props.usuarios}
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
                                                        Header: "Correo",
                                                        accessor: "data.correo",
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
                                                        accessor: "data.creacion.userAdded",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "PERMISOS",
                                                        accessor: "",
                                                        show:true,
                                                        filterable:false,
                                                        Cell: props => 
                                                        <div className="text-center">

                                                        
                                                            
                                                            {
                                                                props.value.data.permisos.w ? 
                                                                <div>
                                                                    <span className="glyphicon glyphicon-plus"></span> Agregar
                                                                </div> : null
                                                            }

                                                            {
                                                                props.value.data.permisos.r ? 
                                                                    <div>
                                                                        <span className="glyphicon glyphicon-edit"></span> Editar
                                                                    </div> : null
                                                            }

                                                            {
                                                                props.value.data.permisos.d ? 
                                                                <div>
                                                                    <span className="glyphicon glyphicon-trash"></span> Eliminar
                                                                </div> : null
                                                            }

                                                            {
                                                                props.value.data.permisos.w === false &&
                                                                props.value.data.permisos.r === false &&
                                                                props.value.data.permisos.d === false ?
                                                                <div>
                                                                    Sin permisos asignados.
                                                                </div> : null
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
                            </div>
                        </div>
                    </div>
            </div>
        )
    }

    editar(values,event){
        this.setState({usuarioForm:true,accion:"editar",usuario:values});
    }

    agregar(event){
        this.setState({usuarioForm:true,accion:"agregar"});
    }


    regresar(event){
        this.setState({usuarioForm:false,usuario:null},()=>{
           this.props.actions.getUsuarios();
        });
    }
}


const mapStateToProps = (state) => {
    return {
        usuarios: state.usuarios.get("usuarios"),
        failGetUsuarios : state.usuarios.get("failGetUsuarios")
    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getUsuarios }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminUsers);