  const ipc = require('electron').ipcRenderer
  ipc.on('import', () => {
    var file = document.getElementById('file');
    console.log('import')
  });

  ipc.on('export', () => {
    var file = document.getElementById('file');
    console.log(file.click());

    var db = require('./js/database');
    db.searchAll().then((records) => {
      var fs = require("fs");
      var path = require('path');
      var out = path.resolve('export.json');
      fs.writeFile(out, JSON.stringify(records, null, '  '))
      alert('Completed!!\n' +  out) // TODO ファイルパスを送って、アラートを表示する
    });
  });
