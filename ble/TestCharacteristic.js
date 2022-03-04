const uuids = require("./uuids")
module.exports = function(Characteristic) {

  const TestCharacteristic = Object.create(Characteristic);

  TestCharacteristic.start = function() {
    this.init({
      uuid: uuids.testCharacteristic,
      properties: ['read', 'indicate'],
      descriptors: [
        {
          uuid: '2902',
          value: 'lemon Message'
        }
      ]
    });

  };

  return TestCharacteristic;
}