const DB_NAME = 'Reminder6'
const DB_VER = 3
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

var searchById = function(noteId, target, scope) {
  console.log(noteId);
  openDb().then((db) => {
    var store = db.transaction([STORE_NANE]).objectStore(STORE_NANE)
    var request = store.get(Number(noteId))
    request.onsuccess = function (evt) {
      var record = evt.target.result
      target.noteId = record.noteId
      target.title = record.title
      target.text = record.text
      target.tags = record.tags
      scope.$apply()
    }
  })
}

var register = function(data) {
  openDb().then((db) => {
    var transaction = db.transaction([STORE_NANE], "readwrite")
    var store = transaction.objectStore(STORE_NANE)
    var request = data.noteId == undefined ? store.add(data) : store.put(data)
    request.onsuccess = function(event) {
      console.log('success register:')
      console.log(event)
    }
  })
}

var deleteNote = (noteId) =>{
  openDb().then((db) => {
    var transaction = db.transaction([STORE_NANE], "readwrite")
    var store = transaction.objectStore(STORE_NANE)
    var request = store.delete(Number(noteId))
    request.onsuccess = function(event) {
      console.log('success delete:' + noteId)
      console.log(event);
    }
  })
}
