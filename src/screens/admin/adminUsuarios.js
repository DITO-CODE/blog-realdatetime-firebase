import React,{Component} from 'react';


class AdminUsers extends Component{

    constructor(props){
        super(props);
        this.state={
            titulo:"ADMINISTRACIÓN DE USUARIOS"
        };
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
                                       {this.state.titulo}
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                    <button type="button" className="btn btn-danger btn-sm"
                                        
                                    >
                                        <span className="glyphicon glyphicon-list-alt"></span> Agregar
                                    </button>
                                </div>

                                {/*
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
                                                        show:true,
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
                                    : null*/

                                }
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default AdminUsers;