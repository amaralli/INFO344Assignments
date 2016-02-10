'use strict';

var app = angular.module('users', [])
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

		$scope.submit2 = function() {

			//var changeDisplayName = {
			//	displayName : $scope.displayName
			//};
			//console.log($scope.user);
			//console.log($scope.email + "BADBADBADBAD");
			var newData = {
				displayName : $scope.changeDisplayName
			}

			//var newDispl = $scope.displayName;
			//console.log(newDispl);
			$http.put('/api/updateDispl', newData)
				.then(function(response) {
					$scope.displayName = $scope.changeDisplayName;
				})
				.catch(function(err) {
					console.log("newDispl fail");
					console.log(err);
				})
		}

		$scope.submit3 = function() {

			var data = {
				oldPass : $scope.curPass,
				newPass : $scope.newPassword,
				confirmPass : $scope.confirmNewPassword
			}

			//if(newPass == confirmPass) {
				$http.put('/api/updatePass', data)
				.then(function(response) {

				})
			//} else {
				console.log("passwords don't match up");
			//}


		}


	}) 

//	.controller('DisplayChangeController', function($scope, $http) {
		
//	})

//	.controller('PassChangeController', function($scope, $http) {
		
		

//	})
;
