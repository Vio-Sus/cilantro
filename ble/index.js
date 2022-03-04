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

  console.log("initialize ble")
  
  service.onConnect = function() {
    console.log("connected to service")
  }

  function startAdvertising() {
    console.log("start advertising")
    bleno.startAdvertising('Cilantrio', [service.uuid]);
    console.log("Add service", service)
    bleno.setServices([service]);
  }

  function stopAdvertising() {
    console.log("stop advertising")
    stopAdvertising()
  }


  bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    blenoState = state
  
    if (state === 'poweredOn' && shouldStart) {
      startAdvertising()
    } else {
      stopAdvertising()
    }
  });
  
  bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  
    if (!error) {
      // bleno.setServices([service]);
    }
  });


  function start() {
    shouldStart = true 
    if (blenoState === 'poweredOn') {
      startAdvertising()
    } 
  }

  function stop() {
    shouldStart = false 
    stopAdvertising()
  }

  return {start, stop, statusCharacteristic}
}
