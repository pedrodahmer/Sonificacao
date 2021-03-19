const { ipcRenderer } = require('electron')

window.onload = function() {

    const controlador = document.getElementById('player-control')
    const opcaoVisualizador = document.getElementById('selecionar-visualizador')
    const visualizador = document.getElementById('visualizer')

    /*
    ipcRenderer.on('entrada-arquivo-midi', (event, args) => {
        console.log(args)
        controlador.src = `../../files/${args}.mid`
    })
    ipcRenderer.send('obter-ultimo-arquivo')
    */

    visualizador.config = {
        noteHeight: 6,
        activeNoteRGB: '255, 0, 0',
        scrollType: 1
    }

    opcaoVisualizador.addEventListener('click', () => {
        let opcao = opcaoVisualizador.options[opcaoVisualizador.selectedIndex]

        if (opcao.value == 'waterfall') {
            visualizador.type = 'waterfall'
        } else if (opcao.value == 'staff') {
            visualizador.type = 'staff'
            visualizador.config = { noteHeight: 8, activeNoteRGB: '255, 0, 0', scrollType: 1 }
        } else {
            visualizador.type = 'piano-roll'
        }
    })
}
