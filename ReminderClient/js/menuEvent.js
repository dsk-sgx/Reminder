(function() {
  const ipc = require('electron').ipcRenderer
  ipc.on('import', () => {
    var file = document.getElementById('file');
    console.log(this)
  });
})