var baseUrl = 'http://localhost:8081/Reminder/'
// $(function(){

  var createDb = function(storeName) {
    var indexedDB = window.indexedDB;
    var idbReq = indexedDB.open("Reminder", 1);
    idbReq.onupgradeneeded = function (event) {
      var db = event.target.result;
      var store = db.createObjectStore("t_note", { keyPath: "note_id" });
      store.createIndex("tags", "tags");
      store.createIndex("title", "title");
      store.createIndex("text", "text");
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
	  });
    console.log('sync end')
  }

  var write = function(data) {
    console.log('write start')
    var idbReq = indexedDB.open("Reminder", 1);
    var db;
    idbReq.onsuccess = function (event) {
      console.log('onsuccess')
      db = idbReq.result;
      var transaction = db.transaction(['t_note'], "readwrite");
      var store = transaction.objectStore('t_note');
      $(data).each(function(index) {
    	var record = {"note_id":this.noteId, "title":this.title, "text":this.text, "tags":this.tags};
        store.add(record)
      })
    }
    idbReq.onerror = function(event) {
      console.log('onerror')
    }
    console.log('write end')
  }

  syncData()

  var searhAll = function(scope, keyword) {
    var records = []
    openDb().then((db) => {
      var trans = db.transaction(['t_note']);
      var store = trans.objectStore('t_note');
      var request = store.openCursor();
      request.onsuccess = (event) => {
        var cursor = event.target.result;
        if (cursor) {
          scope.records.push({noteId:cursor.value.note_id, title:cursor.value.title, text:cursor.value.text, tags:cursor.value.tags})
          scope.$apply()
          cursor.continue();
        }
      }
    })
  }

  var searchById = function(noteId) {
    return new Promise(function(resolve, reject) {
      openDb().then((db) => {
        var store =db.transaction(['t_note']).objectStore('t_note')
        var request = store.get(Number(noteId))
        request.onsuccess = function (evt) {
          var record = evt.target.result
          if (record === undefined) {
            return // TODO ここが通らないようにする
          }
          var result = {'noteId':record.note_id, 'title':record.title, 'text':record.text, 'tags':record.tags};
          resolve(result)
        }
      })
    })
  }

  var insert = function(data) {

  }

  var searchByKeyword = function(keyword) {
    return new Promise(function(resolve, reject) {
      openDb().then((db) => {
        var store =db.transaction(['t_note']).objectStore('t_note')
        var request = store.get(Number(noteId))
        request.onsuccess = function (evt) {
          var record = evt.target.result
          var result = {'noteId':record.note_id, 'title':record.title, 'text':record.text, 'tags':record.tags};
          resolve(result)
        }
      })
    })
  }
  var openDb = function() {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open("Reminder", 1);
    return new Promise(function(resolve, reject) {
      idbReq.onsuccess = (event) => resolve(idbReq.result)
      idbReq.onerror = (event) => reject(event)
    })
  }
// })
