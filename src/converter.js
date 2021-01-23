const { ipcRenderer } = require('electron')
import {PythonShell} from 'python-shell';

document.getElementById("converter").addEventListener('click', async () => {
    PythonShell.run('/scripts/csvmidi.py', null, function (err) {
        if (err) throw err;
        console.log('pedrao');
      });
})