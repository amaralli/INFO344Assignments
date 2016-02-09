'use strict';

angular.module('users', [])
	.constant('api', '/api/v1')
	.controller('UserController', function($scope, $http, apiRoot) {
		$scope.newUser = {};

		$http.get('/profile')
			.then(function(response){
				$scope.users = response.data;
			})
			.catch(function(err) {
				console.log("ruh roh");
			})

	}); 
