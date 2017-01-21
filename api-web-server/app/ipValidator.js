const fs = require('fs')
exports.ipsToValidate = []
exports.isValidatingIPs = false
exports.clientsWaitingForCodes = []
var isIpFileOpen = false
var ipsFromDisk = [] //contains array of {ip: , date:}
var browser = null


exports.setBrowser = function(wb) {browser = wb}

exports.queueForValidation = function(client) {
  exports.ipsToValidate.push(client)
  if (exports.isValidatingIPs == false) {
    exports.isValidatingIPs = true
    exports.validateIPs()
  }
}

//recursive
exports.validateIPs = function() {
  if(exports.ipsToValidate.length != 0) {
    var client = exports.ipsToValidate.shift()
    var lastTimeRequested = findOnRestrictedList(client.ip)
    if(lastTimeRequested != null) { // is on list?
      if(true) { //change to hasBeen48Hours(lastTimeRequested) to enable
        console.log("48 hours has passed")
        queueForCode(client.response) //queue client to receive a code
        //replace previous date with new date
        ipsFromDisk.map(item => {
          if(item.ip == client.ip) {
            item.date = new Date()
            return
          }
        })
      } else {
          console.log("48 hours has not passed")
          client.response.send("You received a pass within the last 2 days.")
      }
    } else { // add to people waiting for code
      console.log("Wasnt on the list")
      queueForCode(client.response)
      ipsFromDisk.push({ip:client.ip, date: new Date()})
    }
    exports.validateIPs()
  }
  else if(exports.ipsToValidate.length == 0) {
    console.log("Writing IPs to disk...")
    writeIpsToDisk() //save all new restricted ips
  }
}

function findOnRestrictedList(ip) {
  if(!isIpFileOpen) {
    isIpFileOpen = true
    var data = fs.readFileSync('app/restrictedIps.json')
    if(data != null) {
      ipsFromDisk = JSON.parse(data)
    }
  }
  var date = null
  //map through array and find ip
  ipsFromDisk.map(item => {
    console.log("Mapping through")
    if(item.ip == ip) {
      console.log("Item was %s",JSON.stringify(item))
      date = item.date
    }
  })
  console.log(`Returning ${date}`)
  return date
}

function queueForCode(response) {
  console.log(`Queueing 1 code`)
  exports.clientsWaitingForCodes.push(response)
  if(browser.isFindingCodes == false)
    browser.findCodesFor(exports.clientsWaitingForCodes)
}

function hasBeen48Hours(time) {
  var lastRequest = new Date(time).getTime() + 10000//1.728e+8//time they last requested
  var currentTime = new Date().getTime()
  console.log(`LR:${lastRequest} CT:${currentTime}`)
  return (currentTime > lastRequest) ? true : false
}

function writeIpsToDisk() {
  fs.writeFileSync('app/restrictedIps.json', JSON.stringify(ipsFromDisk))
  isIpFileOpen = false
  exports.isValidatingIPs = false
  console.log("Wrote restricted ips to disk.")
}
