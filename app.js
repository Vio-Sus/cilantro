const setupBLE = require('./ble')
const ble = setupBLE()

// const serialManager = require('./serial/serialManager');
// const dataManager = require('./serial/dataManager')(serialManager);

let stateChangedCallback = () => {}

// dataManager.on('stateChanged', data => {
//   const string = JSON.stringify(data)
//   console.log(data)
//   // console.log('stateChanged', data);
//   // console.log(data.pounds/10000, "lbs")
//   stateChangedCallbacks.forEach(callback => {
//     callback(Buffer.from(string, 'utf8'));
//   })
// });

// serialManager.start(serialManager.vendorIds.uno2);

setInterval(() => {
  const string = JSON.stringify({pounds: Math.random()})
  stateChangedCallback(Buffer.from(string, 'utf8'));
}, 1000)


ble.statusCharacteristic.onSubscribe = function(maxValueSize, callback) {
  console.log("On Subscribe")
  stateChangedCallback = callback
};

ble.statusCharacteristic.onUnsubscribe = function(maxValueSize, callback) {
  console.log("onUnsubscribe")
  stateChangedCallback = () => {}
};

ble.statusCharacteristic.onIndicate = function() {
  console.log("onIndicate")
}


ble.statusCharacteristic.start()
ble.start()