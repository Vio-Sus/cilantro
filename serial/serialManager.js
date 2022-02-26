const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline');

const EventEmitter = require('events');
const serialManager = new EventEmitter();
module.exports = serialManager;

function write(string) {
  return new Promise((resolve, reject) => {
    this.port.write(string);
    this.port.drain(error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}
serialManager.write = write;

const vendorIds = {
  mini: '0403',
  uno: '1a86',
  nano: '1a86',
  uno2: "2341"
};
serialManager.vendorIds = vendorIds;

function start(vendorId = vendorIds.uno, baudRate = 57600) {
  return SerialPort.list()
  .then(ports => {
    // console.log(ports)
    const arduino = ports.find(port => port.vendorId === vendorId);
    const port = new SerialPort(arduino.path, { baudRate , autoOpen: false });
    this.port = port;
    return port;
  })
  .then(port => {
    return new Promise((resolve ,reject) => {
      port.open((err) => {
        if (err) {
          reject(err);
          return;
        }
        const parser = new Readline();
        port.pipe(parser);
        resolve(parser);
      });
    });
  })
  .then(parser => {
    parser.on('data', line => {
      // console.log("data", line)
      serialManager.emit('data', line);
    });
    return serialManager;
  });
}
serialManager.start = start;
