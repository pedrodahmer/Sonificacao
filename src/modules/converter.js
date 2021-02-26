const { ipcRenderer } = require('electron')
const { PythonShell } = require('python-shell')

const btnConverter = document.getElementById('btn-converter')
const btnEscolherArquivo = document.getElementById('btn-escolher-arquivo')

btnEscolherArquivo.onclick = () => {
    ipcRenderer.send('escolher-arquivo')
}

ipcRenderer.on('arquivo-selecionado', (event, caminho) => {
    console.log('Caminho do arquivo: ', caminho)

    const caminhoArquivo = document.getElementById('caminho')
    caminhoArquivo.value = caminho
})

btnConverter.addEventListener('click', () => {
    

    PythonShell.run('./src/scripts/csvmidi.py', null, (err) => {
        if (err) throw err;
        console.log('finished');
    });

    ipcRenderer.send('sucesso')
})

