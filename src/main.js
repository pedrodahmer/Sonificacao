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

let ultimoArquivoAdicionado = ''

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    resizable: false,
    icon: `${__dirname}/assets/icons/play-button.png`,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
  })

  win.loadFile(`${__dirname}/index.html`)
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
          BrowserWindow.loadFile(`${__dirname}/index.html`)
        }
      },
      {
        label: 'Biblioteca',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile(`${__dirname}/pages/Biblioteca/biblioteca.html`)
        }
      },
      {
        label: 'Sonificar arquivo CSV',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile(`${__dirname}/pages/Converter/converter.html`)
        }
      },
      {
        label: 'Reproduzir MIDI',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile(`${__dirname}/pages/Reproducao/reproducao.html`)
        }
      },
      {
        label: 'Sobre',
        click: (MenuItem, BrowserWindow, event) => {
            BrowserWindow.loadFile(`${__dirname}/pages/Sobre/sobre.html`)
        }
      },
      {
        label: 'Ajuda',
        click: (MenuItem, BrowserWindow, event) => {
          BrowserWindow.loadFile(`${__dirname}/pages/Ajuda/ajuda.html`)
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

  let converter = new PythonShell(`${__dirname}/scripts/engine.py`)

  converter.send(args)

  let campos = JSON.parse(args)

  converter.on('message', function(message){
    console.log(message + " pedrao")
  })

  converter.end(function(err) {
    if (err) {
      throw err
    }
    console.log('finished')
    const result = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
      title: 'Sucesso!',
      type: 'info',
      message: 'Conversão concluída! Deseja reproduzir a sonificação agora?',
      buttons: ['Sim', 'Não'],
    })
    if (result == 0) {
      ultimoArquivoAdicionado = campos['nomeArquivo']
      BrowserWindow.getFocusedWindow().loadFile(`${__dirname}/pages/Reproducao/reproducao.html`)
    }
  })

})

ipcMain.on('obter-ultimo-arquivo', (event, args) => {
  event.reply('entrada-arquivo-midi', ultimoArquivoAdicionado) 
})

ipcMain.on('escolher-arquivo-midi', async event => {
  const result = await dialog.showOpenDialog({
    title: 'Procurando arquivos MIDI...',
    buttonLabel: 'Abrir',
    message: 'Mensagem',
    properties: ['openFile'],
    filters: [
      {
        name: 'Musical Instrument Digital Interface',
        extensions: ['mid', 'midi']
      }
    ]
  })
  if(result) {
    event.sender.send('escolha-arquivo-midi', result.filePaths[0])
  }
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
