// var baseUrl = location.protocol + '/Reminder/';
var baseUrl = 'http://localhost:8081/Reminder/';

var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
		"listController",
		function($scope) {

			$scope.records= [
				{"title":"title11", "text":"text1"},
				{"title":"title12", "text":"text2"},
				{"title":"title13", "text":"text3"},
				{"title":"title14", "text":"text4"},
				{"title":"title15", "text":"text5"}
			]
			$scope.size = $scope.records.length;


			$scope.search = function() {
				console.log($scope.keyword)

			}

			$scope.searchTag = function() {
				console.log($scope.tag)
				$scope.keyword = tag;
			}
		})

// 詳細
.controller(
		'detailController',
		function($scope, $routeParams, $http, $location, $anchorScroll) {
			$http.get(baseUrl + 'notes/' + $routeParams.noteId).success(
					function(data, status, headers, config) {
						$scope.view = data;
					})
			$anchorScroll();

			$scope.edit = function() {
				console.log('edit')
				$location.path('/edit/' + $routeParams.noteId);
			}
			$scope.delete = function() {
				if (window.confirm("削除しますか？")) {
					console.log('delete')
					$http.delete(baseUrl + 'notes/'+ $routeParams.noteId)
					.success(function(data, status, headers, config) {
						console.log('data:' + data)
						console.log('status:' + status)
						console.log('headers:' + headers)
						console.log('config:' + config)
						$location.path('/notes/');
					}).error(function(data, status, headers, config) {
						$scope.result = '通信失敗！';
						console.log(data);
						console.log(status)
						console.log(headers)
						console.log(config)
						alert('削除処理でエラーが発生しました。')
					});
				}
			}

			$scope.searchTag = function(key) {
				console.log(key)
				$scope.keyword = 'tag';
			}
		})
// 更新
.controller(
		'editController',
		function($scope, $routeParams, $http, $location) {
			console.log('edit:' + $routeParams.noteId)
			$http.get(baseUrl + 'notes/' + $routeParams.noteId).success(
					function(data, status, headers, config) {
						$scope.record = data;
					})

			$scope.submit = function() {
				console.log('edit:submit');
				var data = {};
				data.noteId = $scope.record.noteId;
				data.title = $scope.record.title;
				data.text = $scope.record.text;

				if (Array.isArray($scope.record.tags)) {
					data.tags =	$scope.record.tags;
				} else {
					var tags = $scope.record.tags.replace(' ', ",");
					data.tags = tags.split(',');
				}

				console.log(data);
				$http.post(baseUrl + 'notes/', data, {
					headers : {
						'Content-Type' : 'application/json; charset=UTF-8'
					}
				}).success(function(data, status, headers, config) {
					console.log('data:' + data)
					console.log('status:' + status)
					console.log('headers:' + headers)
					console.log('config:' + config)
					$location.path('/notes/' + $routeParams.noteId)
				}).error(function(data, status, headers, config) {
					$scope.result = '通信失敗！';
					console.log(data);
					console.log(status)
					console.log(headers)
					console.log(config)
					alert('更新処理でエラーが発生しました。')
				});
			}
		})

// 登録
.controller('createController', function($scope, $http, $location) {
	$scope.submit = function() {
		var data = {};
		data.title = $scope.record.title;
		console.log(Array.isArray($scope.record.tags))
		if (Array.isArray($scope.record.tags)) {
			data.tags =	$scope.record.tags;
		} else {
			var tags = $scope.record.tags.replace(' ', ",");
			data.tags = tags.split(',');
		}
		data.text = $scope.record.text;
		console.log(data)
		$http.post(baseUrl + 'notes/', data, {
			headers : {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}).success(function(data, status, headers, config) {
			console.log(data)
			$location.path('/notes/' + data.noteId)
		}).error(function(data, status, headers, config) {
			$scope.result = '通信失敗！';
			console.log(data);
			console.log(status)
			console.log(headers)
			console.log(config)
		});
	}
})

module.config(function($routeProvider) {
	$routeProvider.when('/notes/', {
		controller : 'listController',
		templateUrl : 'detail.html',
	}).when('/notes/:noteId/', {
		controller : 'detailController',
		templateUrl : 'detail.html',
	}).when('/record/', {
		controller : 'createController',
		templateUrl : 'record.html',
	}).when('/edit/:noteId', {
		controller : 'editController',
		templateUrl : 'record.html',
	}).otherwise({
		redirectTo : '/notes/'
	});
});
