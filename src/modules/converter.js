const { ipcRenderer } = require('electron')
const { PythonShell } = require('python-shell')
const { path } = require('path')

const btnConverter = document.getElementById('btn-converter')
const btnEscolherArquivo = document.getElementById('btn-escolher-arquivo')

const toggleBtnAltura = document.getElementById('usar-altura')
const toggleBtnIntensidade = document.getElementById('usar-intensidade')
const toggleBtnDuracao = document.getElementById('usar-duracao')

const caminhoArquivo = document.getElementById('caminho')
const colunaAltura = document.getElementById('altura')
const colunaIntensidade = document.getElementById('intensidade')
const colunaDuracao = document.getElementById('duracao')

btnEscolherArquivo.addEventListener('click', () => {
    ipcRenderer.send('escolher-arquivo')
})

ipcRenderer.on('arquivo-selecionado', (event, result) => {
    caminhoArquivo.value = result
})

toggleBtnAltura.addEventListener('click', () => {
    if(toggleBtnAltura.checked) {
        colunaAltura.disabled = false
    } else {
        colunaAltura.disabled = true
        colunaAltura.value = ''
    }
})

toggleBtnIntensidade.addEventListener('click', () => {
    if(toggleBtnIntensidade.checked) {
        colunaIntensidade.disabled = false
    } else {
        colunaIntensidade.disabled = true
        colunaIntensidade.value = ''
    }
})

toggleBtnDuracao.addEventListener('click', () => {
    if(toggleBtnDuracao.checked) {
        colunaDuracao.disabled = false
    } else {
        colunaDuracao.disabled = true
        colunaDuracao.value = ''
    }
})

function verificarCamposVazios() {
    if( !toggleBtnAltura.checked && 
        !toggleBtnIntensidade.checked &&
        !toggleBtnDuracao.checked ) {
        return false
    }
    return true
}

function verificarArquivoVazio() {
    if(caminhoArquivo.value == '') {
        return false
    }
    return true
}

btnConverter.onclick = () => {

    if(verificarArquivoVazio()) {
        if(verificarCamposVazios()) {

            let campos = {
                caminho: caminhoArquivo.value,
                altura: colunaAltura.value,
                intensidade: colunaIntensidade.value,
                duracao: colunaDuracao.value
            }
        
            /*
            let opcoes = {
                mode: 'text',
                scriptPath: './src/scripts',
                args: [JSON.stringify(campos)]
            }
            */
        
            ipcRenderer.send('converter', JSON.stringify(campos))
    
        } else {
            ipcRenderer.send('aviso-campos-vazios')
        }
    } else {
        ipcRenderer.send('aviso-arquivo-vazio')
    }

    

    /*
    PythonShell.run('./src/scripts/csvmidi.py', null, (err) => {
        if (err) throw err;
        console.log('finished')
    })

    ipcRenderer.send('sucesso')
    */
}

