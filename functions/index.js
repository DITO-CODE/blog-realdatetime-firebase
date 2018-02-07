const initClass = require("./initializer.js");

var modulos = [];

modulos.push(require("./contenidos/contenidos"));

modulos.push(require("./usuarios/usuarios"));


var apis = initClass.initFunctions(modulos);
for(var api of apis){
    exports[api.function]=api.handler;
}
