const bleno = require('bleno')
const uuids = require('../uuids')

/**
 * 
 * @param {A function that returns a promise that resolves to an array of network objects that look like {bssid, signalLevel, ssid}} networks 
 */
class ReadCharacteristic extends bleno.Characteristic {
  weightData = {}
  constructor() {
    super({
      uuid: uuids.testCharacteristic,
      properties: ['read', 'indicate'],
      descriptors: [
        {
          uuid: '2902',
          value: 'lemon Message'
        }
      ]
    })
  }

  onReadRequest(offset, callback) {
    const string = JSON.stringify(this.weightData)
    const buffer = Buffer.from(string, 'utf8')
    console.log("Sent data to central", buffer, string)
    callback(this.RESULT_SUCCESS, buffer)
  }
}

module.exports = ReadCharacteristic
