const { ipcRenderer } = require('electron')

window.onload = function() {

    const btnConverter = document.getElementById('btn-converter')
    const btnEscolherArquivo = document.getElementById('btn-escolher-arquivo')

    const toggleBtnAltura = document.getElementById('usar-altura')
    const toggleBtnIntensidade = document.getElementById('usar-intensidade')
    const toggleBtnDuracao = document.getElementById('usar-duracao')

    const caminhoArquivo = document.getElementById('caminho')
    const colunaAltura = document.getElementById('altura')
    const colunaIntensidade = document.getElementById('intensidade')
    const colunaDuracao = document.getElementById('duracao')
    const nomeArquivo = document.getElementById('nome-arquivo')

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

    function verificarNomeArquivoVazio() {
        if (nomeArquivo.value == '') {
            return false
        }
        return true
    }

    function limparCampos () {
        caminhoArquivo.value = ''
        toggleBtnAltura.checked = false
        toggleBtnIntensidade.checked = false
        toggleBtnDuracao.checked = false
        colunaAltura.disabled = true
        colunaAltura.value = ''
        colunaIntensidade.disabled = true
        colunaIntensidade.value = ''
        colunaDuracao.disabled = true
        colunaDuracao.value = ''
        nomeArquivo.value = ''        
    }

    btnConverter.onclick = () => {

        if (verificarArquivoVazio()) {
            if (verificarCamposVazios()) {
                if (verificarNomeArquivoVazio()) {
                    let campos = {
                        caminho: caminhoArquivo.value,
                        altura: colunaAltura.value,
                        intensidade: colunaIntensidade.value,
                        duracao: colunaDuracao.value,
                        nomeArquivo: nomeArquivo.value
                    }
                    ipcRenderer.send('converter', JSON.stringify(campos))
                } else {
                    ipcRenderer.send('aviso-nome-arquivo-vazio')
                }
            } else {
                ipcRenderer.send('aviso-campos-vazios')
            }
        } else {
            ipcRenderer.send('aviso-arquivo-vazio')
        }

        limparCampos()
    }

}
