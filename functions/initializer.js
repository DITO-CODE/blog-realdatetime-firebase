const express = require("express");
const functions = require("firebase-functions");

exports.initFunctions = function(modulos) {
	var appFunctions = [];
    
	for (var mod of modulos) {
	    
		var app = express();
    	app.use((req, res, next)=>{
        	res.header('Access-Control-Allow-Origin','*');
        	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
        	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
        
        	next();
        });
        
		for (var api of mod.api) {
			if (api.post) {
				app.post(api.path, api.handler);
			} else {
				app.get(api.path, api.handler);
			}
		}
        
		appFunctions.push({ "function": mod.function, "handler": functions.https.onRequest(app)});
		exports[mod.function] = functions.https.onRequest(app);
	}
    
	return appFunctions;
};