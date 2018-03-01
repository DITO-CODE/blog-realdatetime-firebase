import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import {getUsuariosSuscritos} from '../../reducer/usuarios'
import ImportUsuarios from './usuarios/importUsuarios';


class UsuariosSuscritos extends Component{

    constructor(props){
        super(props);
        this.state={
            titulo:"ADMINISTRACIÓN DE USUARIOS SUSCRITOS"
        };
    }

    componentDidMount(){
        this.props.actions.getUsuariosSuscritos();
    }

    render(){

        if(this.state.usuarioForm){
            return <ImportUsuarios  
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
                                    this.props.usuariosSuscritos ?
                                        <div className="col-md-12 text-center tablaArticulos">
                                            <ReactTable
                                                resizable= {true}
                                                data={this.props.usuariosSuscritos}
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
                                                        accessor: "data.email",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "Nombre",
                                                        accessor: "data.nombre",
                                                        show:true,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value}
                                                        </div>
                                                    },
                                                    {
                                                        Header: "Suscrito",
                                                        accessor: "data.activo",
                                                        show:true,
                                                        filterable:false,
                                                        Cell: props => 
                                                        <div className="text-center">
                                                            {props.value?
                                                            
                                                                <span className="glyphicon glyphicon-ok">

                                                                </span>
                                                                : 
                                                                <span className="glyphicon glyphicon-remove">
                                                                
                                                                 </span>
                                                            }
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

    agregar(event){
        this.setState({usuarioForm:true,accion:"agregar"});
    }

    regresar(event){
        this.setState({usuarioForm:false},()=>{
            this.props.actions.getUsuariosSuscritos();
        });
    }

}


const mapStateToProps = (state) => {
    return {
        usuariosSuscritos: state.usuarios.get("usuariosSuscritos"),
        failGetUsuariosSuscritos: state.usuarios.get("failGetUsuariosSuscritos")
    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getUsuariosSuscritos }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(UsuariosSuscritos);