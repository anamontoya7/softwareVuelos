var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "software"
});

con.connect(function(err) {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Se perdio la conexión con la base de datos.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos tiene demasiadas conexiones.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('La base de datos rechazo la conexión.');
    }
  }
   else{
    console.log('Conectados a la base de datos.');
     /*  con.query("SELECT * FROM aerolineas", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });*/
   }
});