const { 
  app, 
  BrowserWindow, 
  ipcMain, 
  dialog,
  Menu,
  MenuItem
} = require('electron')

const { PythonShell } = require('python-shell')

// require('electron-reload')(__dirname)

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
      }
    ]
  },
  {
    label: 'Dev',
    submenu: [
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      },
      {
        label: 'Reload',
        role: 'reload'
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

/*
ipcMain.on('sucesso', (event) => {
  dialog.showMessageBox(null, 'pedrao')
})
*/

ipcMain.on('escolher-arquivo', async event => {
  const result = await dialog.showOpenDialog({
    title: 'Procurando arquivos CSV...',
    buttonLabel: 'Abrir',
    message: 'Mensagem',
    properties: ['openFile'],
    filters: [
      {
        name: 'Comma Separated Values',
        extensions: ['csv']
      }
    ]
  })
  if(result) {
    event.sender.send('arquivo-selecionado', result.filePaths[0])
  }
})

ipcMain.on('converter', (event, args) => {

  /*
  PythonShell.run('hello.py', args, function(err, results) {
    if (err) throw err
    console.log(`Retorno do Python: ${results}`)
  })
  */

  let converter = new PythonShell('./src/scripts/engine.py')

  converter.send(args)

  /*
  converter.on('message', function(message){
  })
  */

  converter.end(function(err) {
    if (err) throw err
    console.log('finished')
    const result = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
      title: 'Sucesso!',
      type: 'info',
      message: 'Conversão concluída! Deseja reproduzir a sonificação agora?',
      buttons: ['Sim', 'Não'],
    })
    if (result == 0) {
      BrowserWindow.getFocusedWindow().loadFile('./Pages/Reproducao/reproducao.html')
    }
  })

})

ipcMain.on('aviso-arquivo-vazio', () => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    title: 'Aviso!',
    type: 'warning',
    message: 'Por favor, informe o caminho do arquivo',
    buttons: ['OK']
  })
})

ipcMain.on('aviso-campos-vazios', () => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    title: 'Aviso!',
    type: 'warning',
    message: 'Por favor, informe pelo menos um parâmetro',
    buttons: ['OK']
  })
})

ipcMain.on('aviso-nome-arquivo-vazio', () => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    title: 'Aviso!',
    type: 'warning',
    message: 'Por favor, informe um nome para o arquivo de saída',
    buttons: ['OK']
  })
})
