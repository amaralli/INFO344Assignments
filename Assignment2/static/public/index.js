'use strict';

angular.module('signin', [])
	.controller('SignInController', function($scope, $http, $window) {

		$scope.show = false;

		$scope.submit = function() {
			var newUser = {
				email : $scope.email,
				password : $scope.password
			};

			$http.post('/api/login', newUser)
				.then(function(response){
					console.log("somehow this shit is chill");
					$window.location.href = '/profile.html';
				})
				.catch(function(err) {
					$scope.show = "true";
					console.log("ruh roh");
				});
		}

	}); 