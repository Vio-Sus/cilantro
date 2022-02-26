const bleno = require('bleno');

const Characteristic = require('./Characteristic')(bleno);
const PrimaryService = require('./PrimaryService')(bleno);

const StatusCharacteristic = require('./StatusCharacteristic')(Characteristic);

const uuids = require("./uuids")


const events = [
  'advertisingStart',
  'advertisingStartError',
  'advertisingStop',
  // 'servicesSet',
  'servicesSetError',
  'accept',
  'disconnect',
  'rssiUpdate',
  ]
  
  events.forEach(event => {
    bleno.on(event, function(error) {
      console.log(`on -> ${event}: ` + (error ? 'error ' + error : 'success'));
    })
  })


module.exports = function() {
  let blenoState
  let shouldStart = false

  const statusCharacteristic = Object.create(StatusCharacteristic);
  exports.statusCharacteristic = statusCharacteristic
  
  const service = Object.create(PrimaryService);
  service.init(uuids.deviceService, [statusCharacteristic]);
  
  service.onConnect = function() {
    "connected to service"
  }


  bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    blenoState = state
  
    if (state === 'poweredOn' && shouldStart) {
      bleno.startAdvertising('Cilantrio', [service.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });
  
  bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  
    if (!error) {
      bleno.setServices([service]);
    }
  });


  function start() {
    shouldStart = true 
    if (blenoState === 'poweredOn') {
      bleno.startAdvertising('Cilantrio', [service.uuid]);
    } 
  }

  function stop() {
    shouldStart = false 
    bleno.stopAdvertising();
  }

  return {start, stop, statusCharacteristic}
}
