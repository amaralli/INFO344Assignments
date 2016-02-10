'use strict';

angular.module('users', [])
	.controller('UserController', function($scope, $http, apiRoot) {
		$scope.newUser = {};

		$http.get('/profile')
			.then(function(response){
				$scope.email = response.data.email;
				$scope.displayName = response.data.displayName;
			})
			.catch(function(err) {
				console.log("ruh roh");
			})

	}); 
