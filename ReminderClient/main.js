const {app, Menu, BrowserWindow, ipcMain} = require('electron');

var template = Menu.buildFromTemplate(
  [
    {
        label: 'File',
        submenu: [
          {
            label: 'New',
            click: () => {
                console.log('New');
            }
          },
          {
            label: 'Import',
            click: () => {
              win.webContents.send('import', '');
            }
          },
          {
            label: 'Export',
            click: function() {
<<<<<<< HEAD
              exportData()
=======
              win.webContents.send('export', '');
>>>>>>> f70cd4c449c010f4845ce5ff4f97dcec43d564b9
            }
          },
          {
            label: 'Quit',
            click: () => {
              app.quit();
            }
          }
        ]
    }
  ]
);

<<<<<<< HEAD
// 新しいウィンドウ(Webページ)を生成
=======
>>>>>>> f70cd4c449c010f4845ce5ff4f97dcec43d564b9
let win;

function exportData() {
  console.log("export")
  win.webContents.send('export')
}

function createWindow() {

  Menu.setApplicationMenu(template)

  // BrowserWindowインスタンスを生成
  win = new BrowserWindow({width: 1200, height: 800});
  win.loadURL(`file://${__dirname}/index.html`);
<<<<<<< HEAD
  // デバッグするためのDevToolsを表示
  win.webContents.openDevTools();
  // ウィンドウを閉じたら参照を破棄
=======
>>>>>>> f70cd4c449c010f4845ce5ff4f97dcec43d564b9
  win.on('closed', () => {   // ()は　function ()と書いていい
    win = null;
  });
 // win.webContents.openDevTools();
}

// アプリの準備が整ったらウィンドウを表示
app.on('ready', createWindow);
// 全てのウィンドウを閉じたらアプリを終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('import', function (event, arg) {
  console.log(arg)  // prints "ping"
  // event.sender.send('asynchronous-reply', 'pong')
})
