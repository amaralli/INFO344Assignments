'use strict';

var app = angular.module('users', [])
	.controller('UserController', function($scope, $http) {
		$scope.newUser = {};

		$scope.showPass = false;
		$scope.showProf = false;
		$scope.confirmPass = false;
		$scope.incorrectPass = false;

		$http.get('/profile')
			.then(function(response) {
				$scope.email = response.data.email;
				$scope.displayName = response.data.displayName;
				$scope.gravatarUrl = response.data.gravatarUrl;
				if(!response.data.oAuth) {
					$scope.showPass = true;
				} 
			})
			.catch(function(err) {
				console.log("ruh roh");
			})

		$scope.profile = function() {
			console.log("made it to the profile view");
			$scope.showProf = true;
		}

		$scope.hideProfile = function() {
			console.log("hide profile");
			$scope.showProf = false;
		}

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
					window.alert("Display name changed!");
					$scope.changeDisplayName = "";
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

			if($scope.newPassword == $scope.confirmNewPassword) {
				$scope.confirmPass = false;
				$http.put('/api/updatePass', data)
				.then(function(response) {
					$scope.incorrectPass = false;
					window.alert("Password changed!");
					$scope.curPass = "";
					$scope.newPassword = "";
					$scope.confirmNewPassword = "";
				})
				.catch(function(response) {
					$scope.incorrectPass = true;
				})
			} else {
				$scope.confirmPass = true;
				console.log("passwords don't match up");
			}


		}


	}) 

//	.controller('DisplayChangeController', function($scope, $http) {
		
//	})

//	.controller('PassChangeController', function($scope, $http) {
		
		

//	})
;
