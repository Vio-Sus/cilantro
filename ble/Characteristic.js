
module.exports = function(service) {
  const Characteristic = Object.create(service.Characteristic.prototype);

  Characteristic.init = function (characteristics) {
    if (characteristics.descriptors) {
      characteristics.descriptors = characteristics.descriptors.map(descriptor => {
        return new service.Descriptor(descriptor); 
      })
      service.Characteristic.call(this, characteristics);
    }
  }

  return Characteristic;
}

