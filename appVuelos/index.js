//modulos
const express = require('express'); 


//inicializacion
const server = express();

//setting
server.set('port',process.env.PORT || 8080);
server.use(express.static("vistas"));

//Server on
server.listen(server.get('port'),function(){
    console.log('Server on Port:',server.get('port'))
});
 