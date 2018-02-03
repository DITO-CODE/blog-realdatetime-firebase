import React, { Component } from 'react';
import {connect} from 'react-redux';
import Login from './screens/login';
import AdminPanel from './screens/admin/adminPanel';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      user:false
    }
  }

  componentDidMount(){
    var usuario = localStorage.getItem("user");
    if(usuario){
      this.setState({user:JSON.parse(usuario)});
    }
  }

  render() {
    if(this.props.user || this.state.user){
      return(
        <AdminPanel user={this.props.user?this.props.user.user:this.state.user} />
      )
    }else{
      return <Login />
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.get("user")
  };
}


export default connect(
  mapStateToProps
)(App);
