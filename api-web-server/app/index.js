//boiler plate stuff to use frameworks
const express = require('express')
const app = express()
path = require('path')
const port = 3030
const cors = require('cors')
const webBrowser = require('./webBrowser.js')
const ipValidator = require('./ipValidator.js')
ipValidator.setBrowser(webBrowser)
//all codes donated or scanned within first half hour

var results = []
//begin listening
app.listen(port, (err) => {
  if (err) {
    return console.log("Something happened while listening", err)
  }
  webBrowser.readCodesFromDisk()
  console.log(`Server is listening on ${port}`)
})

//access base link
app.get('/',(request, response) => {
  console.log(request.url)
  response.sendFile(path.join(__dirname,'../index.html'))
})

app.get('/request?',cors(), (request, response, next) => {
  console.log(`Code requested from IP:${request.connection.remoteAddress}`)
  ipValidator.queueForValidation({ip:request.connection.remoteAddress, response: response})
})

//handle donations
app.get('/donate?',cors(), (request, response, next) =>{
  var code = request.query.gp
  console.log(`Code donation :${code}`)
  //push code onto allCodes for verification
  webBrowser.donatedCodes.push(code)
  response.send("success")
})
