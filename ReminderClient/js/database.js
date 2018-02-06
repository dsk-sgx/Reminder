const DB_NAME = 'Reminder'
const DB_VER = 1
const STORE_NANE = 'notes'

var initializeDb = function() {
  var indexedDB = window.indexedDB
  var idbReq = indexedDB.open(DB_NAME,DB_VER)
  idbReq.onupgradeneeded = function (event) {
    var db = event.target.result
    var store = db.createObjectStore(STORE_NANE, {keyPath:'noteId', autoIncrement:true})
    store.createIndex(STORE_NANE, 'noteId', { unique: true });
  }
  idbReq.onerror = function (event) {
    console.log('error');
    console.log(event);
  }
}

initializeDb();

var openDb = function() {
  var indexedDB = window.indexedDB
  var idbReq = indexedDB.open(DB_NAME, DB_VER)
  return new Promise(function(resolve, reject) {
    idbReq.onsuccess = (event) => resolve(idbReq.result)
    idbReq.onerror = (event) => reject(event)
  })
}

var searhAll = function(scope, keyword) {
  openDb().then((db) => {
    console.log('searhAll start');
    var trans = db.transaction([STORE_NANE])
    var store = trans.objectStore(STORE_NANE)
    var request = store.openCursor()
    var count = 0;
    request.onsuccess = (event) => {
      var cursor = event.target.result
      if (cursor) {
        scope.records.push({noteId:cursor.value.noteId, title:cursor.value.title, text:cursor.value.text, tags:cursor.value.tags})
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

var searhAllSync = function() {
  var records = [];
  openDb().then((db) => {
    var trans = db.transaction([STORE_NANE])
    var store = trans.objectStore(STORE_NANE)
    var request = store.openCursor()
    var count = 0;
    request.onsuccess = (event) => {
      var cursor = event.target.result
      if (cursor) {
        records.push({noteId:cursor.value.noteId, title:cursor.value.title, text:cursor.value.text, tags:cursor.value.tags})
        cursor.continue()
      } else {
        console.log("return ");
        console.log(records);
        return records;
      }
    }
  })
}

var searchById = function(noteId) {
  return new Promise(function(resolve, reject) {
    console.log(noteId);
    openDb().then((db) => {
      var store = db.transaction([STORE_NANE]).objectStore(STORE_NANE)
      var request = store.get(Number(noteId))
        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = (event) => reject(event)
    })
  })
}

var register = function(data) {
  return new Promise(function(resolve, reject) {
    openDb().then((db) => {
      var transaction = db.transaction([STORE_NANE], "readwrite")
      var store = transaction.objectStore(STORE_NANE)
      var request = store.put(data)
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event)
    })
  })
}

var deleteNote = (noteId) =>{
  return new Promise(function(resolve, reject) {
  openDb().then((db) => {
    var transaction = db.transaction([STORE_NANE], "readwrite")
    var store = transaction.objectStore(STORE_NANE)
    var request = store.delete(Number(noteId))
    request.onsuccess = (event) => resolve(event)
    request.onerror = (event) => reject(event)
  })
})
}
