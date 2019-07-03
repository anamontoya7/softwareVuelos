//modulos
const express = require('express'); 
var path = require('path');
var mysql = require('mysql');

//inicializacion
const server = express();

//setting
server.set('port',process.env.PORT || 8080);
server.use(express.static("vistas"));

////conexion a base de datos
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "software"
});

//index.html
server.get('/',function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));	
});

///pasajeros
server.get('/html/pasajeros.html',function(req, res){
	res.sendFile(path.join(__dirname+'/html/pasajeros.html'));
});

////aerolinea
server.get('/html/aerolineas.html',function(req, res){
	res.sendFile(path.join(__dirname+'/html/aerolineas.html'));
});

////prueba
server.get('/GetFulData',function(req, res){
	var origenObt = req.query.origen || '';
	
	 console.log(origenObt);
	res.sendFile(path.join(__dirname+'/html/aerolineas.html'));
});

//Server on
server.listen(server.get('port'),function(){
    console.log('Server on Port:',server.get('port'))
	 console.log('Server on Port:',server.get('port'))
});
 