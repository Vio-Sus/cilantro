/**
 * ble
 */

const peripheral = require('./ble/peripheral');
const WeightService = require('./ble/WeightService');

let status = "off"

const weightService = new WeightService();
function startPeripheral() {
  if (status === "on") {
    return
  }
  status = "on"

  peripheral.start("Cillllllaaaaaantrio", [weightService])
}

function stopPeripheral() {
  status = "off"
  peripheral.stop()
}



// status === "on" ? stopPeripheral() : startPeripheral({readWifiData, readDeviceData})
startPeripheral()


/**
* Arduino
*/


const serialManager = require('./serial/serialManager');
const dataManager = require('./serial/dataManager')(serialManager);

dataManager.on('stateChanged', data => {
  const weightData = {
    ...data,
    poundsIgnore: data.pounds,
    pounds: data.pounds/10000
  }

  weightService.weightData = weightData
});

async function connectToArduino() {
  try {
    await serialManager.start(serialManager.vendorIds.uno2);
  } catch {
    console.log("failed to connect to arduino")

    setTimeout(connectToArduino, 1000)
  }
}

connectToArduino()