const SerialPort = require('serialport')

return SerialPort.list()
  .then(ports => {
    console.log(ports)
  })