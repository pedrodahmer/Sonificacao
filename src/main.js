const { 
  app, 
  BrowserWindow, 
  ipcMain, 
  dialog,
  Menu,
  MenuItem
} = require('electron')

require( 'electron-reload')(__dirname)

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.loadFile('index.html')
}

const template = [
  {
    label: 'Arquivo',
    submenu: [
      { role: 'quit' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ]
  },
  {
    label: 'Navegar',
    submenu: [
      {
        label: 'Início',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile('index.html')
        }
      },
      {
        label: 'Biblioteca',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile('./Pages/Biblioteca/biblioteca.html')
        }
      },
      {
        label: 'Sonificar arquivo CSV',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile('./Pages/Converter/converter.html')
        }
      },
      {
        label: 'Reproduzir MIDI',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile('./Pages/Reproducao/reproducao.html')
        }
      },
      {
        label: 'Sobre',
        click: (MenuItem, BrowserWindow, event) => {
            BrowserWindow.loadFile('./Pages/Sobre/sobre.html')
        }
      },
      {
        label: 'Ajuda',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile('./Pages/Ajuda/ajuda.html')
        }
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      }
    ]
  }
]

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

