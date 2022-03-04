const bleno = require('bleno')
const uuids = require('../uuids')

const NotifyCharacteristic = require('./NotifyCharacteristic')
const ReadCharacteristic = require('./ReadCharacteristic')

class WeightService extends bleno.PrimaryService {

  constructor() {
    const notifyCharacteristic = new NotifyCharacteristic()
    const readCharacteristic = new ReadCharacteristic()
    super({
      uuid: uuids.deviceService,
      characteristics: [
        notifyCharacteristic,
        readCharacteristic
      ]
    })

    this.notifyCharacteristic = notifyCharacteristic
    this.readCharacteristic = readCharacteristic

    this.weightData = {}
  }

  set weightData(data) {
    this._weightData = data
    this.notifyCharacteristic.weightData = data
    this.readCharacteristic.weightData = data
  }
}

module.exports = WeightService