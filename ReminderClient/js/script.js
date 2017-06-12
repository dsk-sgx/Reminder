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
			searchById($routeParams.noteId).then((record) => {
				$timeout(() => {
					console.log(record);
					$scope.view = record;
					$anchorScroll();
				})
			})

			$scope.edit = function() {
				console.log('edit')
				$location.path('/record/' + $routeParams.noteId);
			}

			$scope.delete = function() {
				if (window.confirm("削除しますか？")) {
					deleteNote($routeParams.noteId).then((arg) => {
						console.log('arg');
						console.log(arg);
					  $scope.$parent.records.forEach(function(record, i) {
							if (record.noteId == $routeParams.noteId) {
								$timeout(function() {
									$scope.$parent.records.splice(i, 1)
									$scope.$parent.count = $scope.$parent.records.length
									$location.path('/notes/')
								})
								return;
							}
						})
					})
				}
			}

			$scope.searchTag = function(tag) {
				$timeout(function(){
					if ($scope.$parent.tags.includes(tag)) {
						console.log('inclueds')
						return;
					}
					$scope.$parent.tags.push(tag)
	      })
			}
		})

// 登録/更新
.controller('recordController', function($scope, $routeParams, $location, $anchorScroll, $timeout) {
	var isNew = $routeParams.noteId == undefined
	console.log('isNew:' + isNew);
	if (!isNew) {
		searchById($routeParams.noteId).then((record) => {
			$timeout(() => {
				console.log(record);
				$scope.record = record
				$anchorScroll();
			})
		})
	}

	$scope.submit = function() {
		console.log('create');
		var data = $scope.record;

		if (Array.isArray($scope.record.tags)) {
			// do nothing
		} else if (data.tags == null || data.tags == '') {
			data.tags =	[]
		} else {
			var tags = data.tags.replace(' ', ",");
			data.tags = tags.split(',');
		}
		data.text = $scope.record.text;
		register(data).then((noteId) =>{
			$timeout(() => {
				data.noteId = noteId
				if (isNew) {
					$scope.$parent.records.push(data)
				} else {
					$scope.$parent.records.some(function(record) {
						if (record.noteId == noteId) {
							record.title = data.title
							record.tags = data.tags
							record.text = data.text
							return true
						}
					})
				}
				$scope.$parent.count = $scope.$parent.records.length
				$location.path('/notes/' + noteId)
			})
		})
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

// キーワード・タグ検索のフィルタ
.filter('keywordFilter',function() {
	return function(records, keyword, tags) {
		if (keyword == undefined && tags.length == 0) {
			return records;
		}

		var isMatch = (record, keyword, tags) => {
			var keywords = keyword ==　undefined ? [] : keyword.split(' ')
			var matchKey = () => {
				if (keywords.length == 0) {
					return true;
				}
				var result = true;
				keywords.forEach((keyword) => {
					if (record.title.toLowerCase().indexOf(keyword.toLowerCase()) < 0 &&
							record.text.toLowerCase().indexOf(keyword.toLowerCase()) < 0 &&
							record.tags.indexOf(keyword) < 0) {
						result = false;
						return
					}
				})
				return result;
			}
			var matchTag = () => {
				var result = true;
				tags.forEach((tag) => {
					if (record.tags.length == 0 || record.tags.indexOf(tag) < 0) {
						result = false;
						return;
					}
				})
				return result;
			}
			return matchKey() && matchTag()
		}

		var result = []
		records.forEach((record) => {
			if (isMatch(record, keyword, tags)) {
				result.push(record);
			}
		})
		return result
	}
})

.config(function($sceProvider) {
  $sceProvider.enabled(false);
})

.config(function($routeProvider) {
	$routeProvider.when('/notes/', {
		controller : 'listController',
		templateUrl : 'top.html',
	}).when('/notes/:noteId/', {
		controller : 'detailController',
		templateUrl : 'detail.html',
	}).when('/record/:noteId', {
		controller : 'recordController',
		templateUrl : 'record.html',
	}).when('/record', {
		controller : 'recordController',
		templateUrl : 'record.html',
	}).otherwise({
		redirectTo : '/notes/'
	});
});
