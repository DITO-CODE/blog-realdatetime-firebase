const initClass = require("./initializer.js");

var modulos = [];

modulos.push(require("./contenidos/contenidos"));


var apis = initClass.initFunctions(modulos);
for(var api of apis){
    exports[api.function]=api.handler;
}
