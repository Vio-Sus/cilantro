const bleno = require('bleno');
const uuids = require('../uuids');

class NotifyCharacteristic extends bleno.Characteristic {
  callback = () => {}
  constructor() {
    super({
      uuid: uuids.readCharacteristic,
      properties: ['notify'],
      descriptors: [
        {
          uuid: '2901',
          value: 'lime Message'
        }
      ]
    })
  }

  set weightData(data) {
    const string = JSON.stringify(data)
    const buffer = Buffer.from(string, 'utf8')
    this.callback(buffer)
  }

  onSubscribe(maxValueSize, callback) {
    console.log("onSubscribe")
    this.callback = callback
  }

  onUnsubscribe(maxValueSize, callback) {
    console.log("onUnsubscribe")
    this.callback = () => {}
  }
}

module.exports = NotifyCharacteristic;