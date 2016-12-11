var baseUrl = 'http://localhost:8081/Reminder/'
// $(function(){

  var createDb = function(storeName) {
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
    var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

    //2.indexedDBを開く
    var idbReq = indexedDB.open("Reminder", 1);

    //3.DBの新規作成時、またはバージョン変更時に実行するコード
    idbReq.onupgradeneeded = function (event) {
      var db = event.target.result;
      var noteStore = db.createObjectStore("t_note", { keyPath: "note_id" });
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
    .fail(function(data){ //ajaxの通信に失敗した場合
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

  var searhAll = function() {
    var records = []
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open("Reminder", 1);
    return new Promise(function(resolve, reject) {
      idbReq.onsuccess = function (event) {
        var db = idbReq.result;
        var trans = db.transaction(['t_note'], 'readonly');
        var store = trans.objectStore('t_note');
        var request = store.openCursor();
        request.onsuccess = (event) => {
          var cursor = event.target.result;
          if (cursor) {
            records.push({noteId:cursor.value.note_id, title:cursor.value.title, text:cursor.value.text, tags:cursor.value.tags})
            cursor.continue();
          }
        };
        resolve(records)
      };
    })
  }

  var searchById = function(noteId) {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open("Reminder", 1);
    var result = {}
    return new Promise(function(resolve, reject) {
      idbReq.onsuccess = (event) => {
        var db = idbReq.result
        var trans = db.transaction(['t_note'], 'readonly')
        var store = trans.objectStore('t_note')
        var request = store.get(Number(noteId))
        request.onsuccess = function (evt) {
          if (evt.target.result === undefined) {
            console.log('data not found:' + noteId);
          } else {
            resolve(evt.target.result)
            var record = evt.target.result
            result = {'noteId':record.note_id, 'title':record.title, 'text':record.text, 'tags':record.tags};
          }
        }
      }
    })
  }
// })
