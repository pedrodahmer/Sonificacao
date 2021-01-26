const { ipcRenderer } = require('electron')
const { PythonShell } = require('python-shell')

const btnConverter = document.getElementById('converter');

btnConverter.addEventListener('click', () => {
    PythonShell.run('./src/scripts/csvmidi.py', null, (err) => {
        if (err) throw err;
        console.log('finished');
    });
    
    ipcRenderer.send('oedrao')
})
