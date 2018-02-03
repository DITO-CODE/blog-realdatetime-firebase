import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {login} from '../reducer/login';

class Login extends  Component{

    render(){
        return(
            <div className="backLogin">
                    <div className="row">
                        <div className="container">
                            <div className="col-md-12 text-center formLogin">
                                <div className="col-md-12 textoTiulo">
                                        LOGIN
                                </div>
                                <div className="col-md-12">
                                    <span className="glyphicon glyphicon-user iconoUsuarioLogin"></span>
                                </div>
                                <div className="col-md-12">
                                        <button className="btn btn-danger btn-login btnLogin"
                                        onClick={this.loginAction.bind(this)}
                                        >Google+</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }

    loginAction(event){
        debugger;
        this.props.actions.login();
    }

}

  
  const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
          login
       }, dispatch)
    }
  }
  
  export default connect(
    null,
    mapDispatchToProps
  )(Login);