const bleno = require('bleno');

let started = false, state, stateChange

function start(name, services) {
  if (started) {
    return
  }
  started = true

  bleno.once('advertisingStart', function(err) {
    if (err) {
      // handle error
      console.log("Error", err); return
    }

    console.log('advertising...')
    bleno.setServices(services)
  })

  function startAdvertising() {
    bleno.startAdvertising(name, services.map(service => service.uuid), (err) => {
      if (err) {
        // handle error
        console.log("Error", err);
      }
    })
  }

  if (state === 'poweredOn') {
    startAdvertising()
    return
  }

  stateChange = function(s) {
    state = s

    if (state !== 'poweredOn') {
      bleno.stopAdvertising()
      return
    }

    startAdvertising()
  }
  bleno.on('stateChange', stateChange)
  
}

exports.start = start;

function stop() {
  bleno.stopAdvertising(() => {
    console.log("bleno.stopAdvertising()")
    started = false
  })

  bleno.removeListener('stateChange', stateChange)
}

exports.stop = stop

bleno.on('error', function(error) {
  console.log("error", error)
})