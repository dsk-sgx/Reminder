var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
	"listController",
	function($scope) {

		$scope.records = []
		searhAll($scope)

		$scope.search = function() {
		}

		$scope.searchTag = function() {
			console.log('searchTag')
			console.log('keyword' + $scope.keyword);
			$scope.keyword = $scope.tag;
		}
	}
)


// 詳細
.controller(
		'detailController',
		function($scope, $routeParams, $location, $anchorScroll, $timeout) {
			console.log('detail')
			searchById($routeParams.noteId).then(function(record) {
				$scope.view = record
				$scope.$apply()
			})
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
			$scope.searchTag = function(tag) {
				$timeout(function(){
					$scope.keyword = tag
					$scope.$apply()
	      })
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
		insert(data)
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
