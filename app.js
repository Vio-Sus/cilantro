
/**
 * Scale
 */

const serialManager = require('./serial/serialManager');
const dataManager = require('./serial/dataManager')(serialManager);

let stateChangedCallback = () => {}
let weightString = "no weight yet"
dataManager.on('stateChanged', data => {
  const string = JSON.stringify({
    ...data,
    poundsIgnore: data.pounds,
    pounds: data.pounds/10000
  })
  weightString = string
  // console.log(data)
  // console.log('stateChanged', data);
  console.log(data.pounds/10000, "lbs")
  stateChangedCallback(Buffer.from(string, 'utf8'))
});

serialManager.start(serialManager.vendorIds.uno2);


// Test without scale

// setInterval(() => {
//   const string = JSON.stringify({pounds: Math.random()})
//   stateChangedCallback(Buffer.from(string, 'utf8'));
// }, 1000)


/**
 * Bluetooth
 */

const setupBLE = require('./ble')
const ble = setupBLE()


ble.testCharacteristic.onRead = function(maxValueSize, callback) {
  console.log("On Read")
  stateChangedCallback(Buffer.from(weightString, 'utf8'))
};

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