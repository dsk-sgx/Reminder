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
    console.log('sync end')
  }

  var write = function(data) {
    console.log('write start')
    openDb().then((db) => {
      var transaction = db.transaction(['notes'], "readwrite")
      var store = transaction.objectStore('notes')
      data.forEach((record) => {
        console.log(record)
        store.add(record);
      })
    })
    console.log('write end')
  }
  
  if (navigator.onLine) {
    syncData()
  } 
