'use strict'; 

var sesion1 = angular.module("sesion1",[]); 
sesion1.controller("ctrl1", function ($scope, $http) {
	
   $scope.user = [];
   $scope.vuelo = [];
   $scope.origen = [];
   $scope.origenes = [];
   $scope.destino = [];
   $scope.destinos = [];
   $scope.SelectedVueloIda = [];
   $scope.SelectedVueloVuelta = [];
   $scope.horas_ida = [];
   $scope.horas_vuelta = [];
   $scope.flies =[];
   $scope.mostrar = false;
   $scope.noVuelos = false;
   $scope.carro = false;
   var numDestino = 0;
   var numVuelo = 0;
   var numVueloVuelta = 0;
   var numfly = 0;
   //variable aerolinea
   $scope.id = [];
   $scope.aerolinea = [];
   $scope.pass = [];
   $scope.aerolineaSesion = [];
   $scope.passSesion = [];
   $scope.carrito = [];
   $scope.carritoTipo;
    
    
   $http({method: 'GET',url: "vuelos.json"}).then(function (archivo) {
	   $scope.user = archivo.data;
	   
		   for(var i = 0; i < $scope.user.vuelos.length; i++){
			   $scope.vuelo = $scope.user.vuelos[i];
			   $scope.origen[i] = $scope.vuelo["origen"];
		   }
		$scope.origenes = $scope.origen.unique().sort();
	
	},function (error){
	   $scope.user = [{name: "Error!! " + error.status}];
	   console.log(error);
	});
		
	$scope.clickOrigen = function() {
		$http.get("/aero/destinos?origen="+ $scope.selectedName).then(function(response) {
			$scope.destinos = response.data;
		})
	}
	
	$scope.billetes = function() {
		var numfly = 0;
		var numVuelo = 0;
		var numVueloVuelta = 0;
		$scope.SelectedVueloIda = [];
		$scope.SelectedVueloVuelta = [];
		$scope.flies.length = 0;
		$scope.selectedOrigen = $scope.selectedName;
		$scope.selectedDestino = $scope.selectedName2;
		$scope.selectedIda = $scope.ida;
		$scope.selectedVuelta = $scope.vuelta;
		$scope.selectedPasajeros = $scope.pasajeros;
		$scope.mostrar = true;
		$scope.noVuelos = false;
		
		
		$http.get("/aero/vuelos?origen="+ $scope.selectedOrigen + "&destino="+$scope.selectedDestino+"&fecha="+$scope.selectedIda+"&plazas="+$scope.pasajeros).then(function(response) {
			var retorno = response.data;
			for(var i = 0; i < retorno.length; i++) {
				$scope.SelectedVueloIda.push({	"vuelo" : retorno[i].vuelo, 
												"origen" : retorno[i].origen, 
												"destino" : retorno[i].destino, 
												"salida" : retorno[i].salida, 
												"llegada" : retorno[i].llegada, 
												"bussiness" : retorno[i].precio_business, 
												"optima" : retorno[i].precio_optima, 
												"economy" : retorno[i].precio_economy, 
												"plazas_bussiness" : retorno[i].plazas_business, 
												"plazas_optima" : retorno[i].plazas_optima, 
												"plazas_economy" : retorno[i].plazas_economy
											});
			}
			
			
			$http.get("/aero/vuelos?destino="+ $scope.selectedOrigen + "&origen="+$scope.selectedDestino+"&fecha="+$scope.selectedVuelta+"&plazas="+$scope.pasajeros).then(function(response) {
				var retorno2 = response.data;
				for(var i = 0; i < retorno2.length; i++) {
					$scope.SelectedVueloVuelta.push({	"vuelo" : retorno2[i].vuelo, 
														"origen" : retorno2[i].origen, 
														"destino" : retorno2[i].destino, 
														"salida" : retorno2[i].salida, 
														"llegada" : retorno2[i].llegada, 
														"bussiness" : retorno2[i].precio_business, 
														"optima" : retorno2[i].precio_optima, 
														"economy" : retorno2[i].precio_economy, 
														"plazas_bussiness" : retorno2[i].plazas_business, 
														"plazas_optima" : retorno2[i].plazas_optima, 
														"plazas_economy" : retorno2[i].plazas_economy
													});
				}
				
				
				for(var l = 0;l<$scope.SelectedVueloIda.length;l++){
				   for(var m = 0;m<$scope.SelectedVueloVuelta.length;m++){
						var date_salidaO = new Date($scope.SelectedVueloIda[l].salida);
						var stringSalidaO = date_salidaO.getHours()-2 + ":" + date_salidaO.getMinutes();
						var date_salidaD = new Date($scope.SelectedVueloVuelta[m].salida);
						var stringSalidaD = date_salidaD.getHours()-2 + ":" + date_salidaD.getMinutes();
						
						var costeB = 0;
						if($scope.SelectedVueloIda[l].plazas_bussiness >= $scope.pasajeros && $scope.SelectedVueloVuelta[m].plazas_bussiness >= $scope.pasajeros)
							costeB = ($scope.SelectedVueloIda[l].bussiness+$scope.SelectedVueloVuelta[m].bussiness)*$scope.pasajeros
						
						var costeO = 0;
						if($scope.SelectedVueloIda[l].plazas_optima >= $scope.pasajeros && $scope.SelectedVueloVuelta[m].plazas_optima >= $scope.pasajeros)
							costeO = ($scope.SelectedVueloIda[l].optima+$scope.SelectedVueloVuelta[m].optima)*$scope.pasajeros
					
						var costeE = 0;
						if($scope.SelectedVueloIda[l].plazas_economy >= $scope.pasajeros && $scope.SelectedVueloVuelta[m].plazas_economy >= $scope.pasajeros)
							costeE = ($scope.SelectedVueloIda[l].economy+$scope.SelectedVueloVuelta[m].economy)*$scope.pasajeros
						
						$scope.flies[numfly] = {	
													"vueloIda"		:	$scope.SelectedVueloIda[l].vuelo + ' / ' + stringSalidaO,
													"vueloVuelta"	:	$scope.SelectedVueloVuelta[m].vuelo + ' / ' + stringSalidaD,
													"costeB"		:	costeB,
													"costeO"		:	costeO,
													"costeE"		:	costeE,
													"ida"			:	$scope.SelectedVueloIda[l],
													"vuelta"		:	$scope.SelectedVueloVuelta[m]
												};
						numfly++;
					}     
				}
				
				if($scope.flies.length == 0){
					$scope.mostrar = false;
					$scope.noVuelos = true;
				}
				
			})
		})
		
		

		
	}
	$scope.reservar = function(data, tipo) {
		$scope.carrito = data;
		$scope.carritoTipo = tipo;
		$scope.carro = true;
	}
	
	$scope.comprar = function() {
		console.log($scope.carrito);
		console.log($scope.carritoTipo);
		$http.get("/aero/compra?"+
					"compradorN="+ $scope.nombreCompradorN + 
					"&compradorA="+ $scope.nombreCompradorA + 
					"&tipo="+$scope.carritoTipo + 
					"&pasajeros="+$scope.pasajeros +
					"&origenO="+$scope.carrito.ida.origen+
					"&destinoO="+$scope.carrito.ida.destino+
					"&salidaO="+$scope.carrito.ida.salida+
					"&origenD="+$scope.carrito.vuelta.origen+
					"&destinoD="+$scope.carrito.vuelta.destino+
					"&salidaD="+$scope.carrito.vuelta.salida).then(function(response) {
			alert("Comprado");
		})
	}
    
    $scope.cambioPasajeros = function(valor) {
        $scope.selectedPasajerosComprobacion = $scope.pasajeros;
        console.log($scope.selectedPasajerosComprobacion);
        if ($scope.pasajeros == undefined) {
            $scope.mostrar = false;
        }
    }
	
	$scope.registerAero = function() {
		$scope.id = $scope.idAero;
		$scope.aerolinea = $scope.nameAero;
		$scope.pass = $scope.passAero;
		console.log($scope.id);
		console.log($scope.aerolinea);
		console.log($scope.pass);
		console.log("/aero/register?id="+ $scope.id +"&name="+ $scope.aerolinea + "&pass="+$scope.pass);
		$http.get("/aero/register?id="+ $scope.id +"&name="+ $scope.aerolinea + "&pass="+$scope.pass).then(function(response){
		console.log("sacando el resultado");
		console.log(response);
		$scope.name=response.data;
		})
	}
	
	$scope.sesionAero = function() {
		$scope.aerolineaSesion = $scope.nameAeroS;
		$scope.passSesion = $scope.passAeroS;
		$http.get("/aero/sesion?name="+ $scope.aerolineaSesion + "&pass="+$scope.passSesion).then(function(response){
		console.log("sacando el resultado");
		console.log(response);
		$scope.name=response.data;
		})
	}
	
	Array.prototype.unique=function(a){
			return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
	});
    
}); 
    

