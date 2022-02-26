
const serialManager = require('./serial/serialManager');
const dataManager = require('./serial/dataManager')(serialManager);

let stateChangedCallbacks = []

dataManager.on('stateChanged', data => {
  const string = JSON.stringify(data)
  // console.log('stateChanged', data);
  // console.log(data.pounds/10000, "lbs")
  stateChangedCallbacks.forEach(callback => {
    callback(Buffer.from(string, 'utf8'));
  })
});

serialManager.start(serialManager.vendorIds.uno2);


const bleno = require('bleno');

const Characteristic = require('./characteristics/Characteristic')(bleno);
const PrimaryService = require('./characteristics/PrimaryService')(bleno);

const StatusCharacteristic = require('./characteristics/StatusCharacteristic')(Characteristic);

const uuids = require("./characteristics/uuids")


const statusCharacteristic = Object.create(StatusCharacteristic);
statusCharacteristic.start();

const service = Object.create(PrimaryService);
service.init(uuids.deviceService, [statusCharacteristic]);

service.onConnect = function() {
  "connected to service"
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
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
  
    if (!error) {
      bleno.setServices([service]);
    }
  });
  
})


StatusCharacteristic.onSubscribe = function(maxValueSize, callback) {
  console.log("On Subscribe")
  stateChangedCallbacks.push(callback)
};

StatusCharacteristic.onUnsubscribe = function(maxValueSize, callback) {
  console.log("onUnsubscribe")
  stateChangedCallbacks = []
};

StatusCharacteristic.onIndicate = function() {
  console.log("onIndicate")
}