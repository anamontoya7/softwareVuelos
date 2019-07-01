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
   var numDestino = 0;
   var numVuelo = 0;
   var numVueloVuelta = 0;
   var numfly = 0;
   
    
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
		$scope.destinos.length = 0;
		$scope.destino.length = 0;
		numDestino = 0;
		$scope.flies.length = 0;
		$scope.selectedOrigen = $scope.selectedName;
        $scope.mostrar = false;
		$scope.noVuelos = false;
		for(var j = 0; j < $scope.user.vuelos.length; j++){
			$scope.vuelo = $scope.user.vuelos[j];
			if($scope.selectedOrigen == $scope.vuelo["origen"]){
				$scope.destino[numDestino] = $scope.vuelo["destino"];
				numDestino++;
			}
		}
		$scope.destinos = $scope.destino.unique().sort();
	}
	$scope.billetes = function() {
		var numfly = 0;
		var numVuelo = 0;
		var numVueloVuelta = 0;
		$scope.SelectedVueloIda.length = 0;
		$scope.SelectedVueloVuelta.length = 0;
		$scope.flies.length = 0;
		$scope.selectedOrigen = $scope.selectedName;
		$scope.selectedDestino = $scope.selectedName2;
		$scope.selectedIda = $scope.ida;
		$scope.selectedVuelta = $scope.vuelta;
		$scope.selectedPasajeros = $scope.pasajeros;
		$scope.mostrar = true;
		$scope.noVuelos = false;
		
		for(var k = 0; k < $scope.user.vuelos.length; k++) {
			$scope.vuelo = $scope.user.vuelos[k];

			var date_salida = new Date($scope.vuelo["salida"]);

			
			
			if($scope.selectedOrigen == $scope.vuelo["origen"] && $scope.selectedDestino == $scope.vuelo["destino"] 
			&& $scope.selectedIda.getFullYear() == date_salida.getFullYear() && $scope.selectedIda.getMonth() == date_salida.getMonth() && $scope.selectedIda.getDate() == date_salida.getDate()
			) {
				$scope.horas_ida[numVuelo] = date_salida.getHours()-2 + ":" + date_salida.getMinutes();

				$scope.SelectedVueloIda[numVuelo] = $scope.user.vuelos[k];
				numVuelo++;
		   
			} 
			
			if($scope.selectedOrigen == $scope.vuelo["destino"] && $scope.selectedDestino == $scope.vuelo["origen"] 
			&& $scope.selectedVuelta.getFullYear() == date_salida.getFullYear() && $scope.selectedVuelta.getMonth() == date_salida.getMonth() && $scope.selectedVuelta.getDate() == date_salida.getDate()
			) {
				$scope.horas_vuelta[numVueloVuelta] = date_salida.getHours()-2 + ":" + date_salida.getMinutes();

				$scope.SelectedVueloVuelta[numVueloVuelta] = $scope.user.vuelos[k];

				numVueloVuelta++;
		   
			} 
			
		}
		
		

		for(var l = 0;l<$scope.SelectedVueloIda.length;l++){
		   for(var m = 0;m<$scope.SelectedVueloVuelta.length;m++){
				$scope.flies[numfly] = {	
											"vueloIda"		:	$scope.SelectedVueloIda[l].vuelo + ' / ' + $scope.horas_ida[l],
											"vueloVuelta"	:	$scope.SelectedVueloVuelta[m].vuelo + ' / ' + $scope.horas_vuelta[m],
											"costeB"		:	($scope.SelectedVueloIda[l].bussiness+$scope.SelectedVueloVuelta[m].bussiness)*$scope.pasajeros,
											"costeO"		:	($scope.SelectedVueloIda[l].optima+$scope.SelectedVueloVuelta[m].optima)*$scope.pasajeros,
											"costeE"		:	($scope.SelectedVueloIda[l].economy+$scope.SelectedVueloVuelta[m].economy)*$scope.pasajeros
										};
				numfly++;
			}     
		}
		
		if($scope.flies.length == 0){
			$scope.mostrar = false;
			$scope.noVuelos = true;
		}
		
	}
	$scope.comprar = function(valor) {
		alert("El coste del vuelo sera " + valor);
	}
    
    $scope.cambioPasajeros = function(valor) {
        $scope.selectedPasajerosComprobacion = $scope.pasajeros;
        console.log($scope.selectedPasajerosComprobacion);
        if ($scope.pasajeros == undefined) {
            $scope.mostrar = false;
        }
    }
	
	Array.prototype.unique=function(a){
			return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
	});
    
}); 
    

