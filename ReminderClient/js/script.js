var db = require('./js/database')

var module = angular.module("reminder", [ 'ngRoute'])

// 一覧画面
.controller(
	"listController",
	function($scope, $timeout) {
		
		$scope.records = []
		var refresh = (records) => {
			$scope.records = records;
			$scope.count = $scope.records.length;
			$scope.$apply()
		}
		db.searchAll((records, cursor) => {
			if (records.length % 100 == 0) {
				refresh(records);
			}
		}).then((records) => {
			refresh(records);
		})

		$scope.tags = []
		$scope.closeTag = (tag) => {
			$timeout(function () {
				$scope.tags.forEach((value, i) => {
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
			db.searchById($routeParams.noteId).then((record) => {
				$timeout(() => {
					$scope.view = record;
					$anchorScroll();
				})
			})

			$scope.edit = () => {
				var value = "abc";
				console.log(`edit : /record/${$routeParams.noteId}`)
				$location.path(`/record/${$routeParams.noteId}`);
			}

			$scope.delete = () => {
				if (window.confirm("削除しますか？")) {
					db.deleteNote($routeParams.noteId).then((arg) => {
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

			$scope.searchTag = (tag) => {
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
		db.searchById($routeParams.noteId).then((record) => {
			$timeout(() => {
				console.log(record);
				$scope.record = record
				$anchorScroll();
			})
		})
	}

	$scope.submit = () => {
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
		db.register(data).then((noteId) =>{
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

	$scope.parseMarkdown = () => {
    $("#preview").html(marked($scope.record.text))
	}
})

// マークダウンに変換するフィルタ
.filter('marked', () => {
	return (value) => {
    return marked(value);
  };
})

// キーワード・タグ検索のフィルタ
.filter('keywordFilterOld',() => {
	return (records, keyword, tags) => {
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
.filter('keywordFilter',() => {
	var matchTag = (record, tags) => {
    return tags.length == 0 ||
		  tags.every((e) => record.tags.includes(e))
	}
	var matchKeyword = (record, keywords) => {
		return keywords.length === 0  ||
			keywords.every((e) => {
					return 0 <= record.title.toLowerCase().indexOf(e.toLowerCase()) ||
					       0 <= record.text.toLowerCase().indexOf(e.toLowerCase()) ||
								 0 <= record.tags.toString().toLowerCase().indexOf(e.toLowerCase());
			})
	}

	return (records, keyword, tags) => {
		var keywords = keyword ==　undefined ? [] : keyword.split(' ');
		return records
		  .filter((record) => matchTag(record, tags))
			.filter((record) => matchKeyword(record, keywords))
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
