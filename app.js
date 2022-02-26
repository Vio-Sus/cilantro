
const serialManager = require('./serial/serialManager');
const dataManager = require('./serial/dataManager')(serialManager);

dataManager.on('stateChanged', data => {
  console.log('stateChanged', data);
  console.log(data.pounds/10000, "lbs")
});

serialManager.start(serialManager.vendorIds.uno2);
