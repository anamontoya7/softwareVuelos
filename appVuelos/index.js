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


server.get('/aero/destinos',function(req, res){
	var ciudadO = req.query.origen || '';
	
	var sql = "Select DISTINCT(destino) FROM vuelos WHERE origen = '"+ciudadO+"' ORDER BY destino ASC";
	
	con.query(sql, function (err, result) {
		if (err) throw err;
		
		var destinos = [];
		
		for (var i = 0; i < result.length; i++) {
			destinos.push(result[i].destino);
		}
		
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(destinos));
	});
});


server.get('/aero/vuelos',function(req, res){
	var ciudadO = req.query.origen || '';
	var ciudadD = req.query.destino || '';
	var fecha = req.query.fecha || '';
	var DateO = new Date(fecha);
	var plazas = req.query.plazas || '';
	
	var sql = "Select * FROM vuelos WHERE origen = '"+ciudadO+"' AND destino = '"+ciudadD+"'";
	

	con.query(sql, function (err, result) {
		if (err) throw err;
		
		var salida = [];
		
		for (var i = 0; i < result.length; i++) {
			var dateSalida = new Date(result[i].salida);
				
			if(	dateSalida.getFullYear() == DateO.getFullYear() && dateSalida.getMonth() == DateO.getMonth() && dateSalida.getDate() == DateO.getDate()) {
				salida.push(result[i]);
			}
			
		}
		
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(salida));
	});
});


server.get('/aero/compra',function(req, res){
	var compradorN = req.query.compradorN || '';
	var compradorA = req.query.compradorA || '';
	var tipo = req.query.tipo || '';
	var tipoString = 'plazas_business';
	if(tipo = 2)
		tipoString = 'plazas_optima';
	else if(tipo = 3)
		tipoString = 'plazas_economy';
		
	var pasajeros = req.query.pasajeros || '';
	var origenO = req.query.origenO || '';
	var destinoO = req.query.destinoO || '';
	var salidaO = req.query.salidaO || '';
	var origenD = req.query.origenD || '';
	var destinoD = req.query.destinoD || '';
	var salidaD = req.query.salidaD || '';
		
	var sql = "INSERT INTO pasajeros (cod_reserva, numero, nombre, apellidos) VALUES ('0', '0', '"+compradorN+"','"+compradorA+"')";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
	sql = "UPDATE vuelos SET "+tipoString+" = "+tipoString+"-"+pasajeros+" WHERE origen = '"+origenO+"' AND destino = '"+destinoO+"' AND salida = '"+salidaO+"'";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
	sql = "UPDATE vuelos SET "+tipoString+" = "+tipoString+"-"+pasajeros+" WHERE origen = '"+origenD+"' AND destino = '"+destinoD+"' AND salida = '"+salidaD+"'";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
	
	res.end();
	
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
 