// electronモジュールを読み込み
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron; //ウィンドウを表す[BrowserWindow]はelectronモジュールに含まれている

// 新しいウィンドウ(Webページ)を生成
let win;
function createWindow() {
  // BrowserWindowインスタンスを生成
  win = new BrowserWindow({width: 1200, height: 800});
  // index.htmlを表示
  win.loadURL(`file://${__dirname}/index.html`);
  // デバッグするためのDevToolsを表示
  // win.webContents.openDevTools();
  // ウィンドウを閉じたら参照を破棄
  win.on('closed', () => {   // ()は　function ()と書いていい
    win = null;
  });
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

const ipcMain = require('electron').ipcMain
ipcMain.on('asynchronous-message', function (event, arg) {
  console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', function (event, arg) {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})
