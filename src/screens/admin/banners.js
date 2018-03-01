import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getBanners} from '../../reducer/banners'
import BannerContent from './bannerContent';

class Banners extends Component{

    constructor(props){
        super(props);
        this.state={
            titulo:"ADMINISTRACIÓN DE BANNERS",
            banners:false
        };
    }
    
    componentDidMount(){
        var values = {
            limite:3
        }
        this.props.actions.getBanners(values);
    }

    addValores(banners){
       
            if(banners.length<3){
                var cantidadAgregar = 3 - banners.length;
                for(var i=0; i < cantidadAgregar ; i++){
                    banners.push({});
                }
            }
            return banners;
    }


    render(){
        return (

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
                            </div>
                            <div className="col-md-12 panelAdmin">
                                <div className="bannersContent">


                                {
                                    this.props.banners ?
                                     this.addValores(this.props.banners).map((value,index)=>{

                                        console.log(value);
                                        return <BannerContent  key={index} data={value}/>
                                     }) : null
                                }
                                    

                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        banners: state.banners.get("banners"),
        failGetBanners:  state.banners.get("failGetBanners")

    };
  }
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getBanners }, dispatch)
    }
  }
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Banners);