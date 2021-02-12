const { 
  app, 
  BrowserWindow, 
  ipcMain, 
  dialog,
  Menu,
  MenuItem
} = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

const template = [
  {
    label: 'File',
    submenu: [
      { role: 'quit' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('sucesso', (event) => {
  dialog.showMessageBox(null, 'pedrao')
})

app.on('Sobre', () => {
  window.location.href("./pages/Sobre/sobre.html")
})

