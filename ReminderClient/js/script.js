var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
	"listController",
	function($scope, $timeout) {
		$scope.records = []
		searhAll($scope)
		$scope.tags = []

		$scope.closeTag = (tag) => {
			$timeout(function () {
				$scope.tags.forEach(function(value, i) {
					if (tag == value) {
						$scope.tags.splice(i, 1)
						return
					}
				})
			});
		}
	}
)

// 詳細
.controller(
		'detailController',
		function($scope, $routeParams, $location, $anchorScroll, $timeout) {
			$scope.view = {}
			searchById($routeParams.noteId, $scope.view, $scope)
			$anchorScroll();

			$scope.edit = function() {
				console.log('edit')
				$location.path('/edit/' + $routeParams.noteId);
			}
			$scope.delete = function() {
				if (window.confirm("削除しますか？")) {
					deleteNote($routeParams.noteId)
				  $scope.$parent.records.forEach(function(record, i) {
						console.log(record);
						console.log($routeParams.noteId);
						console.log(record.noteId == $routeParams.noteId);
						if (record.noteId == $routeParams.noteId) {
							$timeout(function() {
								$scope.$parent.records.splice(i, 1)
								$scope.$parent.count = $scope.$parent.records.length
								$scope.$apply()
								$location.path('/notes/')
							})
							return;
						}
					})
				}
			}

			$scope.searchTag = function(tag) {
				console.log(tag);
				$timeout(function(){
					$scope.$parent.tags.push(tag)
					$scope.$parent.keyword = tag
					$scope.$parent.$apply()
	      })
			}
		})

// 更新
.controller(
		'editController',
		function($scope, $routeParams, $location, $timeout) {
			$scope.record = {}
			searchById($routeParams.noteId, $scope.record, $scope);

			$scope.submit = function() {
				console.log('edit:submit');
				var data = {}
				data.noteId = $scope.record.noteId;
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
