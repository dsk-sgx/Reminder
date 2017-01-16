  var baseUrl = 'http://localhost:8081/Reminder/'

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
    consこole.log('sync end')
  }

  var write = function(data) {
    console.log('write start')
    openDb().then((db) => {
      var transaction = db.transaction(['notes'], "readwrite")
      var store = transaction.objectStore('notes')
      $(data).each(function(index) {
    	   var record = {"note_id":this.noteId, "title":this.title, "text":this.text, "tags":this.tags}
        store.add(record)
      })
    })
    console.log('write end')
  }
