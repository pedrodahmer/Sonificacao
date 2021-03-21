const { ipcRenderer } = require('electron')

window.onload = function() {

    const controlador = document.getElementById('player-control')
    const opcaoVisualizador = document.getElementById('selecionar-visualizador')
    const visualizador = document.getElementById('visualizer')
    const escolherArquivo = document.getElementById('escolher-arquivo-midi')

    ipcRenderer.on('entrada-arquivo-midi', (event, args) => {
        controlador.src = `../../files/${args}.mid`
    })
    ipcRenderer.send('obter-ultimo-arquivo')

    visualizador.config = {
        noteHeight: 6,
        activeNoteRGB: '255, 0, 0',
        scrollType: 1,
        minPitch: 36,
        maxPitch: 84
    }

    opcaoVisualizador.addEventListener('click', () => {
        let opcao = opcaoVisualizador.options[ opcaoVisualizador.selectedIndex ]

        if ( opcao.value == 'waterfall' ) {
            visualizador.type = 'waterfall'
            visualizador.config = { noteHeight: 8, activeNoteRGB: '255, 0, 0', scrollType: 1, minPitch: 36, maxPitch: 84 }
        } else {
            visualizador.type = 'staff'
            visualizador.config = { noteHeight: 8, activeNoteRGB: '255, 0, 0', scrollType: 1, minPitch: 36, maxPitch: 84 }
        }
    })

    escolherArquivo.addEventListener('click', () => {
        ipcRenderer.send('escolher-arquivo-midi')
    })
    ipcRenderer.on('escolha-arquivo-midi', (event, result) => {
        controlador.src = result
    })

}
