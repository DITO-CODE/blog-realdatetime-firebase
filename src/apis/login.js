import * as firebase from 'firebase';
import {user} from '../reducer/login';

export default  {

    login(){
       
        return new Promise((resolve,reject)=>{
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');

            firebase.auth().signInWithPopup(provider).then(function(result) {
                   
                    var user = result.user;
                    localStorage.setItem('user',JSON.stringify(user));
                    resolve({user:user});

                }).catch(function(error) {
                    /* Handle Errors here.
                    var errorCode = error.code;
                    console.log(errorCode);
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential; */

                    reject({message:"Ocurrio algo al intentar ingresar"});
                    // ...
            });
        }).then(user);
    }

}
