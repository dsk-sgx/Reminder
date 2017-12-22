'use strict'
var database = (() => {
  var DB_NAME = 'Reminder'
  var DB_VER = 1
  var STORE_NANE = 'notes'

  var initializeDb = () => {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open(DB_NAME,DB_VER)
    idbReq.onupgradeneeded = (event) => {
      var db = event.target.result
      var store = db.createObjectStore(STORE_NANE, {keyPath:'noteId', autoIncrement:true})
      store.createIndex(STORE_NANE, 'noteId', { unique: true });
    }
    idbReq.onerror = (event) => {
      console.log('error');
      console.log(event);
    }
  }

  initializeDb();

  var openDb = () => {
    var indexedDB = window.indexedDB
    var idbReq = indexedDB.open(DB_NAME, DB_VER)
    return new Promise((resolve, reject) => {
      idbReq.onsuccess = (event) => resolve(idbReq.result)
      idbReq.onerror = (event) => reject(event)
    })
  }

  var searchAll = (scope) => {
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

  var searchById = (noteId) => {
    return new Promise((resolve, reject) => {
      console.log(noteId);
      openDb().then((db) => {
        var store = db.transaction([STORE_NANE]).objectStore(STORE_NANE)
        var request = store.get(Number(noteId))
          request.onsuccess = (event) => resolve(event.target.result)
          request.onerror = (event) => reject(event)
      })
    })
  }

  var register = (data) => {
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      openDb().then((db) => {
        var transaction = db.transaction([STORE_NANE], "readwrite")
        var store = transaction.objectStore(STORE_NANE)
        var request = store.delete(Number(noteId))
        request.onsuccess = (event) => resolve(event)
        request.onerror = (event) => reject(event)
      })
    })
  }
  return {
    searchAll : searchAll,
    searchById : searchById,
    register : register,
    deleteNote : deleteNote
  }
})();

module.exports = database;
