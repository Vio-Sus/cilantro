const uuids = require("./uuids")
module.exports = function(Characteristic) {

  const StatusCharacteristic = Object.create(Characteristic);

  StatusCharacteristic.start = function() {
    this.init({
      uuid: uuids.readCharacteristic,
      properties: ['notify'],
      descriptors: [
        {
          uuid: '2901',
          value: 'lime Message'
        }
      ]
    });

  };

  return StatusCharacteristic;
}