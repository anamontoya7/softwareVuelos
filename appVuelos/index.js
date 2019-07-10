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
    var fecha_vuelo = req.query.fechaV || '';
	var compradorN = req.query.compradorN || '';
	var compradorA = req.query.compradorA || '';
	var tipo = req.query.tipo || '';
	var tipoString = 'plazas_business';
	if(tipo == 2)
		tipoString = 'plazas_optima';
	else if(tipo == 3)
		tipoString = 'plazas_economy';
	
    console.log(tipoString);
	var pasajeros = req.query.pasajeros || '';
	var origenO = req.query.origenO || '';
	var destinoO = req.query.destinoO || '';
	var salidaO = req.query.salidaO || '';
	var origenD = req.query.origenD || '';
	var destinoD = req.query.destinoD || '';
	var salidaD = req.query.salidaD || '';
    var dat= new Date(); //fecha
    
    var tipoStringss = "npas_businnes";
	if(tipo == 2)
		tipoStringss = "npas_optima";
	else if(tipo == 3)
		tipoStringss = "npas_economy";
    
    var sql = "SELECT cod_reserva FROM pasajeros ORDER BY cod_reserva DESC";
	con.query(sql, function (err, result) {
		if (err) throw err;
        
        var ids = [];
        
		for (var i = 0; i < result.length; i++) {
			ids.push(result[i].cod_reserva);
		}
        var valor = ids[0]+1;
         
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(valor));
        
        sqlt = "INSERT INTO pasajeros (cod_reserva, numero, nombre, apellidos) VALUES ('"+valor+"', '0', '"+compradorN+"','"+compradorA+"')";
        con.query(sqlt, function (err, result) {
		if (err) throw err;
	   });
        
       var sqlt = "INSERT INTO compras (cod_reserva, fecha_compra, fecha_vuelo, vuelo, salida, "+tipoStringss+") VALUES ('"+valor+"','"+dat+"', '"+fecha_vuelo+"', '"+22+"','"+salidaD+"','"+pasajeros+"')";
        con.query(sqlt, function (err, result) {
		if (err) throw err;
	   });
	});
    
    
	sql = "UPDATE vuelos SET "+tipoString+" = "+tipoString+"-"+pasajeros+" WHERE origen = '"+origenO+"' AND destino = '"+destinoO+"' AND salida = '"+salidaO+"'";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
	sql = "UPDATE vuelos SET "+tipoString+" = "+tipoString+"-"+pasajeros+" WHERE origen = '"+origenD+"' AND destino = '"+destinoD+"' AND salida = '"+salidaD+"'";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
    
    
	//res.end();
	
});



server.get('/aero/delete',function(req, res){
	var id = req.query.iddelete || '';
	console.log(id);
	var sql = "DELETE FROM pasajeros WHERE cod_reserva = '"+id+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
		});
    var sqlc = "DELETE FROM compras WHERE cod_reserva = '"+id+"'";
		con.query(sqlc, function (err, result) {
			if (err) throw err;
		});
	
});


server.get('/aero/register',function(req, res){
	var id = req.query.id || '';
	console.log(id);
	var name = req.query.name || '';
	console.log(name);
	var pass = req.query.pass || '';
	console.log(pass);  
    var result1 = [];
	var result2 = [];
	var sql = "SELECT COUNT(*) FROM aerolineas";
        con.query(sql, function (err, result) {
            if (err) throw err;
			result1=JSON.stringify(result);
			console.log("ressss");
			console.log(result1);
        });
    
    var sql = "INSERT INTO aerolineas (id, name, passwd) SELECT '"+ id +"', '"+name+"','"+pass+"' FROM dual WHERE NOT EXISTS (SELECT * FROM aerolineas WHERE name ='"+name+"' or id='"+id+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
            
     var sql = "SELECT COUNT(*) FROM aerolineas";
        con.query(sql, function (err, result) {
            if (err) throw err;
			result2=JSON.stringify(result);
			if(result1==result2){
				res.send("Cambie, el ID por otro")
			}else{
				res.send("Registrado, correctamente");
			}
        });
});

server.get('/aero/sesion',function(req, res){
	var nameSesion = req.query.name || '';
	console.log(nameSesion);
	var passSesion = req.query.pass || '';
	console.log(passSesion);
    
	var sql = "SELECT * FROM aerolineas WHERE name = '"+nameSesion+"' and passwd = '"+passSesion+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length == 0){
				console.log('no se ha iniciado sesion correctamente');
				res.send('/html/aerolineas.html');

			} else{
				console.log('se ha iniciado sesion correctamente');
				res.send('/html/functionsAero.html');
				}
		});
	
});

server.get('/aero/registerVuelo',function(req, res){
	var nameAero = req.query.nameAero || '';
	console.log(nameAero);
	var vuelo = req.query.vueloR || '';
	console.log(vuelo);
	var origen = req.query.origenR || '';
	console.log(origen);
	var destino = req.query.destinoR || '';
	console.log(destino);
	var salida = req.query.salidaR || '';
	console.log(salida);
	var llegada = req.query.llegadaR || '';
	console.log(llegada);
	var precioB = req.query.precioBR || '';
	console.log(precioB);
	var plazasB = req.query.plazasBR || '';
	console.log(plazasB);
    var precioO = req.query.precioOR || '';
	console.log(precioO);
	var plazasO = req.query.plazasOR || '';
	console.log(plazasO);
	var precioE = req.query.precioER || '';
	console.log(precioE);
	var plazasE = req.query.plazasER || '';
	console.log(plazasE);
	var id;
	
	var sql = "SELECT id FROM aerolineas WHERE name = '"+nameAero+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			id = result[0].id;
			var sql = "INSERT INTO vuelos (vuelo, origen, destino, salida, llegada, precio_business, precio_optima, precio_economy, plazas_business, "
				+"plazas_optima, plazas_economy) VALUES ('"+id+"-"+vuelo+"','"+origen+"','"+destino+"','"+salida+"','"+llegada+"','"+precioB+"','"+precioO+"','"+precioE+"','"
				+plazasB+"','"+plazasO+"','"+plazasE+"')";
				
				con.query(sql, function (err, result) {
						if (err) throw err;
						console.log("1 VUELO inserted");
					});
		});
	
});

server.get('/aero/infoVuelo',function(req, res){
	var nameAero = req.query.nameAero || '';
	console.log(nameAero);
	var vuelo = req.query.vueloI || '';
	console.log(vuelo);
	var origen = req.query.origenI || '';
	console.log(origen);
	var destino = req.query.destinoI || '';
	console.log(destino);
	var id;
	
	var sql = "SELECT id FROM aerolineas WHERE name = '"+nameAero+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			id = result[0].id;
			var sql = "SELECT * FROM vuelos WHERE vuelo = '"+id+"-"+vuelo+"' and origen = '"+origen+"' and destino = '"+destino+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			/*if(result.length ==0){
				res.send("ERROR");
			}else{*/
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		});
		});
	
	
	
});


//Server on
server.listen(server.get('port'),function(){
    console.log('Server on Port:',server.get('port')) 
});
