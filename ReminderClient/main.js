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
  win = new BrowserWindow({width: 1200, height: 800});
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => {
    win = null;
  });
  // win.webContents.openDevTools();
}
app.on('ready', createWindow);
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
})
