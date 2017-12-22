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
              win.webContents.send('export', '');
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

let win;
function createWindow() {

  Menu.setApplicationMenu(template)

  // BrowserWindowインスタンスを生成
  win = new BrowserWindow({width: 1200, height: 800});
  win.loadURL(`file://${__dirname}/index.html`);
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
