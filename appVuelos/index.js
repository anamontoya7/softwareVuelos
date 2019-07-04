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
	res.sendFile(path.join(__dirname+'/vistas/html/pasajeros.html'));
});

////aerolinea
server.get('/html/aerolineas.html',function(req, res){
	res.sendFile(path.join(__dirname+'/vistas/html/aerolineas.html'));
});

////prueba
server.get('/aero/register',function(req, res){
	var id = req.query.id || '';
	console.log(id);
	var name = req.query.name || '';
	console.log(name);
	var pass = req.query.pass || '';
	console.log(pass);
	
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "INSERT INTO aerolineas (id, name, passwd) VALUES ('"+ id +"', '"+name+"','"+pass+"')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record inserted");
		});
	});
	
	res.sendFile(path.join(__dirname+'/vistas/html/aerolineas.html'));
});

server.get('/aero/sesion',function(req, res){
	var nameSesion = req.query.name || '';
	console.log(nameSesion);
	var passSesion = req.query.pass || '';
	console.log(nameSesion);
	
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "SELECT * FROM aerolineas WHERE name = '"+nameSesion+"' and passwd = '"+passSesion+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length == 0){
				res.sendFile(path.join(__dirname+'/vistas/html/aerolineas.html'));

			} else{
				console.log(path.join(__dirname+'/vistas/html/functionsAero.html'));
				res.sendFile(path.join(__dirname+'/vistas/html/functionsAero.html'));}
		});
	});
	
});

//Server on
server.listen(server.get('port'),function(){
    console.log('Server on Port:',server.get('port'))
	 console.log('Server on Port:',server.get('port'))
});
 