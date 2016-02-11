'use strict';

angular.module('signin', [])
	.controller('SignInController', function($scope, $http, $window) {

		$scope.show = false;
		$scope.loading = false;

		$scope.submit = function() {
			var newUser = {
				email : $scope.email,
				password : $scope.password
			};

			$scope.loading = true;
			$http.post('/api/login', newUser)
				.then(function(response){
					$scope.loading = false;
					console.log("somehow this shit is chill");
					$window.location.href = '/profile.html';
				})
				.catch(function(err) {
					$scope.loading = false;
					$scope.show = "true";
					console.log("ruh roh");
				});
		}

	}); 