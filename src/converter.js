var py = require('python-shell')

document.getElementById("converter").addEventListener('click', async () => {
    sendToPython()
})

function sendToPython() {

  let options = {
    mode: 'text',
    args: [input.value]
  }

  py.run('/scripts/hello.py', options, function(err, results) {
    if (err) throw err
    console.log('Hello from Python!')
    console.log('Results: ', results)
  })

}