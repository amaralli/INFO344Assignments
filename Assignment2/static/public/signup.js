'use strict';

angular.module('signup', [])
	.controller('SignUpController', function($scope, $http, $window) {


		$scope.show = false;
		$scope.showPassError = false;
		$scope.loading = false;

		$scope.submit = function() {
			console.log("entered signup angular");
			var newUser = {
				email : $scope.email,
				password : $scope.password,
				confirmPass : $scope.confirmPass,
				displayName : $scope.displayName
			};

			if($scope.password == $scope.confirmPass) {
				$scope.showPassError = false;
				$scope.loading = true;
				$http.post('/api/signup', newUser)
					.then(function(response){
						$scope.loading = false;
						console.log("somehow this shit is chill");
						$window.location.href = '/profile.html';
					})
					.catch(function(err) {
						$scope.loading = false;
						$scope.show = true;
						console.log("ruh roh signup");
					});
			} else {
				$scope.showPassError = true;
			}
		}

	}); 