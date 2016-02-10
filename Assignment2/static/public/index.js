'use strict';

angular.module('signin', [])
	.controller('SignInController', function($scope, $http, $window) {

		$scope.submit = function() {
			var newUser = {
				email : $scope.email,
				password : $scope.password
			};

			$http.post('/api/login', newUser)
				.then(function(response){
					console.log("somehow this shit is chill");
					$window.location.href = '/secure.html';
				})
				.catch(function(err) {
					console.log("ruh roh");
				});
		}

	}); 