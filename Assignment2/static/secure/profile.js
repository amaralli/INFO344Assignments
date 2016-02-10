'use strict';

angular.module('users', [])
	.controller('UserController', function($scope, $http) {
		$scope.newUser = {};

		$http.get('/profile')
			.then(function(response) {
				$scope.email = response.data.email;
				$scope.displayName = response.data.displayName;
				$scope.gravatarUrl = response.data.gravatarUrl;
			})
			.catch(function(err) {
				console.log("ruh roh");
			})

	}); 
