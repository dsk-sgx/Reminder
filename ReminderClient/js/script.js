var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
		"listController",
		function($scope) {

			$scope.records= [
				{"noteId":1, "title":"title11", "text":"text1"},
				{"noteId":2, "title":"title12", "text":"text2"},
				{"noteId":3, "title":"title13", "text":"text3"},
				{"noteId":4, "title":"title14", "text":"text4"},
				{"noteId":5, "title":"title15", "text":"text5"}
			]
			$scope.size = $scope.records.length;

			console.log($scope.size);
			$scope.search = function() {
				console.log('search');
				console.log($scope.keyword)
			}
			$scope.searchTag = function() {
				console.log('searchTag')
				$scope.keyword = tag;
			}
		})


// 詳細
.controller(
		'detailController',
		function($scope, $routeParams, $location, $anchorScroll) {
			console.log('detail')
			$scope.view = {
				"title":"titleA",
				"tags":["Java"],
				 "text":"text"
			 };
			$anchorScroll();

			$scope.edit = function() {
				console.log('edit')
				$location.path('/edit/' + $routeParams.noteId);
			}
			$scope.delete = function() {
				if (window.confirm("削除しますか？")) {
					console.log('delete')
				}
			}
			$scope.searchTag = function(key) {
				console.log('searchTag')
				console.log(key)
				$scope.keyword = 'tag';
			}
		})
// 更新
.controller(
		'editController',
		function($scope, $routeParams, $location) {
			console.log('edit:' + $routeParams.noteId)

			$scope.record = {
				"title":"titleA",
				"tags":["Java"],
				 "text":"text"
			 };
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
				}
		})

// 登録
.controller('createController', function($scope, $location) {
	$scope.submit = function() {
		var data = {};
		data.title = $scope.record.title;
		if (Array.isArray($scope.record.tags)) {
			data.tags =	$scope.record.tags;
		} else {
			var tags = $scope.record.tags.replace(' ', ",");
			data.tags = tags.split(',');
		}
		data.text = $scope.record.text;
		console.log(data)
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
