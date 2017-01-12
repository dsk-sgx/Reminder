var baseUrl = 'http://localhost:8081/Reminder/'
// $(function(){

  var createDb = function(storeName) {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open("Reminder",4)
    idbReq.onupgradeneeded = function (event) {
      var db = event.target.result
      var store = db.createObjectStore("t_note", { keyPath: "note_id"})
    }
    idbReq.onerror = function (event) {
      console.log('error');
      console.log(event);
    }
  }

  var syncData = function() {
    console.log('sync start')
    $.ajax({
      type: 'GET',
      url: baseUrl + 'notes'
    })
    .done(function(data){
      write(data);
	  })
    .fail(function(data){
      console.log('offline')
	  })
    console.log('sync end')
  }

  var write = function(data) {
    console.log('write start')
    openDb().then((db) => {
      var transaction = db.transaction(['t_note'], "readwrite")
      var store = transaction.objectStore('t_note')
      $(data).each(function(index) {
    	   var record = {"note_id":this.noteId, "title":this.title, "text":this.text, "tags":this.tags}
        store.add(record)
      })
    })
    console.log('write end')
  }

  createDb()
  syncData()

  var searhAll = function(scope, keyword) {
    openDb().then((db) => {
      console.log('searhAll start');
      var trans = db.transaction(['t_note'])
      var store = trans.objectStore('t_note')
      var request = store.openCursor()
      var count = 0;
      request.onsuccess = (event) => {
        var cursor = event.target.result
        if (cursor) {
          scope.records.push({noteId:cursor.value.note_id, title:cursor.value.title, text:cursor.value.text, tags:cursor.value.tags})
          cursor.continue()
          count++
        }
        if (100 == count || !cursor) {
          scope.count = scope.records.length
          scope.$apply()
          count = 0
        }
        console.log('searhAll end');
      }
    })
  }

  var searchById = function(noteId, target, scope) {
    openDb().then((db) => {
      var store = db.transaction(['t_note']).objectStore('t_note')
      var request = store.get(Number(noteId))
      request.onsuccess = function (evt) {
        var record = evt.target.result
        target.noteId = record.note_id
        target.title = record.title
        target.text = record.text
        target.tags = record.tags
        scope.$apply()
      }
    })
  }

  var register = function(data) {
    openDb().then((db) => {
      var transaction = db.transaction(['t_note'], "readwrite")
      var store = transaction.objectStore('t_note')
      console.log(data);
      var request = store.put(data)
      request.onsuccess = function(evt) {
        console.log('success')
      }
    })
  }

  var deleteNote = (noteId) =>{
    openDb().then((db) => {
      var transaction = db.transaction(['t_note'], "readwrite")
      var store = transaction.objectStore('t_note')
      var request = store.delete(Number(noteId))
      request.onsuccess = function(evt) {
        console.log('success delete:' + noteId)
      }
    })
  }

  var openDb = function() {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open("Reminder", 4)
    return new Promise(function(resolve, reject) {
      idbReq.onsuccess = (event) => resolve(idbReq.result)
      idbReq.onerror = (event) => reject(event)
    })
  }
// })
