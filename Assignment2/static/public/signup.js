'use strict';

angular.module('signup', [])
	.controller('SignUpController', function($scope, $http, $window) {

		$scope.show = false;

		$scope.submit = function() {
			var newUser = {
				email : $scope.email,
				password : $scope.password,
				confirmPass : $scope.confirmPass,
				displayName : $scope.displayName
			};

			$http.post('/api/signup', newUser)
				.then(function(response){
					console.log("somehow this shit is chill");
					$window.location.href = '/secure.html';
				})
				.catch(function(err) {
					$scope.show = true;
					console.log("ruh roh");
				});
		}

	}); 