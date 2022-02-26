const EventEmitter = require('events');
const dataManager = new EventEmitter();

let currentStateText = "";

module.exports = function(serialManager) {

  // data must be a valid javascript object
  function setState(data) {
    const text = JSON.stringify(data);
    return serialManager.write(text);
  }
  dataManager.setState = setState;

  serialManager.on('data', text => {

    // console.log(text)
    
    // console.log(text);

    if (currentStateText === text) {
        return;
    }
    try {
      // console.log(text)
      const data = JSON.parse(text);
      dataManager.currentState = data;
      dataManager.emit("stateChanged", data)
      currentStateText = text;
    } catch (error) {
      // console.log("Error parsing json");
      currentStateText = null
    }
  });

  return dataManager;
}

