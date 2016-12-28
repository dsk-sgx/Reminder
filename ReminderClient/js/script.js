var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
	"listController",
	function($scope) {
		$scope.records = []
		searhAll($scope)
	}
)

// 詳細
.controller(
		'detailController',
		function($scope, $routeParams, $location, $anchorScroll, $timeout) {
			console.log('detail')
			searchById($routeParams.noteId).then(function(record) {
				$timeout(function(){
					$scope.view = record
				})
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
				console.log(tag);
				$timeout(function(){
					$scope.$parent.keyword = tag
					$scope.$parent.$apply()
	      })
			}
		})

// 更新
.controller(
		'editController',
		function($scope, $routeParams, $location, $timeout) {

			searchById($routeParams.noteId).then(function(record) {
				$timeout(function(){
					$scope.record = record
				})
			})

			$scope.submit = function() {
				console.log('edit:submit');
				var data = {}
				data.note_id = $scope.record.noteId;
				data.title = $scope.record.title;
				data.text = $scope.record.text;

				if (Array.isArray($scope.record.tags)) {
					data.tags =	$scope.record.tags;
				} else {
					var tags = $scope.record.tags.replace(' ', ",");
					data.tags = tags.split(',');
				}

				register(data)
				$scope.$parent.records.forEach(function(record) {
					if (record.noteId == $routeParams.noteId) {
						record.title = data.title;
						record.tags = data.tags;
						record.text = data.text;
						return;
					}
				})
				$location.path('/notes/' + $routeParams.noteId);
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
		register(data)
	}
	$scope.parseMarkdown = function() {
    $("#preview").html(marked($scope.record.text))
	}
})

// マークダウンに変換するフィルタ
.filter('marked', function() {
	return function(value) {
    return marked(value);
  };
})

.config(function($sceProvider) {
  $sceProvider.enabled(false);
})

.config(function($routeProvider) {
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
