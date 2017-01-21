//set up the base web driver that allows us to create drivers(browsers)
const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

const fs = require('fs')
const gpRegEx = /[A-Z0-9]{11}/g
//actually create our browser currently :safari
var driver = new webdriver.Builder()
  .forBrowser('safari')
  .build();

//threads and identifiers used to locate codes
var allThreads = [
  {url: "http://www.crunchyroll.com/forumtopic-803801/the-official-guest-pass-thread-read-opening-post-first?pg=",
  identifier: "div .showforumtopic-message-contents-text",
  title: "Crunchyroll",
  page: 3278},
  {url: "https://www.reddit.com/r/anime/comments/5onwbb/crunchyroll_guestpass_thread/",
  title: "Crunchyroll Guest-Pass Thread : anime",
  identifier: "div .md > p"}
]

exports.donatedCodes = [] //codes donated
exports.isFindingCodes = false // is webBrowser finding codes to give to clients
exports.isValidating = false // is webBrowser validating normal codes for storage
var isPValidatorLoggedIn = false //is webBrowser logged into crunchyroll
var validatedCodes = []  //codes that are valid (FOR NOW)
var testOutput = { valid: 0, invalid: 0}
var threadCodes = [] //codes from threads scanned every 1/4 day

//validate donated codes every 30 minutes
var confirmDonationCodesEvery30Mins = setInterval(() => {
  confirmCodes(exports.donatedCodes)
}, 1.8e+6)

//scan & validate thread codes every 6 hours
var scanTheadsAndValidateEvery6Hours = setInterval(() => {
  exports.scanAllThreads()
}, 2.16e+7)

//increment cr thread page every 24 hours
var incrementCrTheadPageEvery24Hours = setInterval(() => {
  allThreads[0].page++
}, 2.16e+7)

//make webdirver log into crunchyroll (thennable)

//Validates a batch of guest passes within an array
//It operates recursively (it must) until there are no more guest passes
//Passes maybe be added to array during execution through the donation link
// Params : allCodes (array)
function confirmCodes(codesToValidate){
    exports.isValidating = true
    var code = codesToValidate.shift()
    console.log(`Attempting to validate code : ${code}`)

    var error = null
    var url = null
    //go to the guest pass page
    driver.get('http://www.crunchyroll.com/guest_pass')
    //wait until the continue button is present on the page, if its then its loaded
    driver.wait(until.elementLocated(By.id('guestpass_redeem_code'))).sendKeys(code+'\n')
    driver.sleep(1500)
    .then( function () {
        return driver.getCurrentUrl() //return currently url when able to retrieve
    })
    .then(localUrl => {
      url = localUrl
      // driver.sleep(1500)
    })
    //if redirected to homepage, pass is invalid. if we arent, it is
    .then(() => {
      if(url != "http://www.crunchyroll.com/") {
        return driver.findElement(By.css("tbody tr:nth-child(2) td:nth-child(2)")).getText()
      }
    })
    .then(expires => {
      if(url === "http://www.crunchyroll.com/") {
        console.log(`${code} wasnt found.`)
        testOutput.invalid++
      } else if(expires == "Expired!") {
        console.log(`${code} expired.`)
        testOutput.invalid++
      }
      else {
        console.log(`${code} is valid`)
        testOutput.valid++
        validatedCodes.push(code)
      }
      //handle more codechecking
      if(codesToValidate.length != 0) {
        console.log("More codes to go...")
        confirmCodes(codesToValidate)
      } else {
        console.log("No more codes.. quiting")
        console.log("Printing results of test")
        // results.forEach((item) => console.log(item))
        console.log(testOutput)
        console.log("Finished validating current stack of codes")
        exports.isValidating = false
        isLoggedIn = false
        driver.close() // close driver but still available for quick us
        exports.writeCodesToDisk()
      }
    })
}


//parses the array of possibleCodes
function parseStringForCode(possibleCodes) {
  if(possibleCodes != null) {
    possibleCodes.forEach(item => threadCodes.push(item))
    }
  }

//all codes found will be appended to the allCodes array for validation
function scanThread(url, identifier, title, iteration, resolve, page=0) {
  if(typeof(page) !== undefined) {  //optional checking
    console.log("Concatenating urls")
    url = url.concat(page)
  }
  var map = webdriver.promise.map
  var elements = {}
  console.log("Scanning %s", url)
  //go thread
  driver.get(url)
  driver.sleep(1000)
  // .then(function() {
  //   console.log("Page loaded")
  driver.wait(until.titleContains(title))
  .then(function (){
    elements = driver.findElements(By.css(identifier))
  })
  .then(function(allPasses) {
    map(elements, ele => ele.getText()).then(function (elements) {
      elements.forEach(ele => {
        possibleCodes = ele.match(gpRegEx) //returns an array of possibleCodes
        parseStringForCode(possibleCodes)
      })
    })
  })
  .then(() => {
    console.log("Finished parsing page, printing results. Found %d", threadCodes.length)
    console.log(threadCodes)
    if(iteration == allThreads.length-1) {
      resolve("All threads completed")
    }
  })
}

exports.scanAllThreads = function() {
  if(exports.isValidating) {
    console.log("Busy validating..")
  }
  else {
    console.log("Scanning all threads")
    var p1 = new Promise(function (resolve, reject) {
      allThreads.forEach((thread, index) => { // scan each thread allThreads
          scanThread(thread.url, thread.identifier, thread.title, index, resolve, thread.page)
      })
    })
    p1.then(() => {
      console.log("Logging into crunchyroll..")
      driver.get('https://www.crunchyroll.com/login')
      driver.sleep(5000)
      driver.wait(until.titleContains("Sign Up or Log In"))
      .then(() => {
        driver.findElement(By.name("login_form[name]")).sendKeys("dougeemmanuel1@gmail.com")
        driver.findElement(By.name("login_form[password]")).sendKeys("emmanuel1\n")
        console.log("Logged in.")
        isLoggedIn = true
        driver.sleep(10000)
      })
      .then(() => confirmCodes(threadCodes))
    })
  }
}

exports.readCodesFromDisk = function (){
  console.log("Reading valid codes from disk")
  var codeData = fs.readFileSync('app/validCodes.json')
  validatedCodes = JSON.parse(codeData)
  console.log("Current codes available: %d.", validatedCodes.length)
}
exports.writeCodesToDisk = function(_validatedCodes = validatedCodes) {
  console.log("Attempting to save codes to disk")
  if (_validatedCodes.length != 0) {
    // console.log(process.cwd()) // get path of processes cwd
      var newValidCodes = JSON.stringify(validatedCodes)
      fs.writeFile('app/validCodes.json', newValidCodes, err => {
        if(err) {
          console.log(`Error while writing ${err}`)
        }
        console.log("Wrote codes to disk.")
      })
  }
  else {
    console.log("There are no codes to save")
  }
}

//recursvely resolve client's requests for codes
exports.findCodesFor = function(clientsWaiting) {
  console.log("Finding codes..")
  if(clientsWaiting.length != 0) {
    var resp = clientsWaiting.shift()
    exports.isFindingCodes = true
    if(validatedCodes.length != 0) {
      var req1 = new Promise((resolve, reject) => {
        var codeIsInvalid = false
        var code = validatedCodes.shift() //pull code from stack
        console.log(`code shifted was ${code}`)
        if(!isPValidatorLoggedIn) {
          console.log("Logging into crunchyroll..")
          driver.get('https://www.crunchyroll.com/login')
          driver.sleep(5000)
          driver.wait(until.titleContains("Sign Up or Log In"))
          .then(() => {
            driver.findElement(By.name("login_form[name]")).sendKeys("dougeemmanuel1@gmail.com")
            driver.findElement(By.name("login_form[password]")).sendKeys("emmanuel1\n")
            console.log("Logged in.")
            isPValidatorLoggedIn = true
            driver.sleep(10000)
          })
        }
        console.log(`Priority validating: ${code}`)
        var error = null
        var url = null
        driver.get('http://www.crunchyroll.com/guest_pass')
        driver.wait(until.elementLocated(By.id('guestpass_redeem_code'))).sendKeys(code+'\n')
        driver.sleep(1500)
        .then( function() {return driver.getCurrentUrl()})
        .then(localUrl => {url = localUrl})
        .then(() => {
          if(url != "http://www.crunchyroll.com/") {
            return driver.findElement(By.css("tbody tr:nth-child(2) td:nth-child(2)")).getText()
          }
        })
        .then(expires => {
          if(url === "http://www.crunchyroll.com/") {
            console.log(`${code} wasnt found.`)
            console.log("Unshifting code")
            clientsWaiting.unshift(resp)
            exports.findCodesFor(clientsWaiting)
          } else if(expires == "Expired!") {
            console.log(`${code} expired.`)
            console.log("Unshifting code")
            clientsWaiting.unshift(resp)
            exports.findCodesFor(clientsWaiting)
          }
          else {
            console.log(`${code} is valid, sending code`)
            resp.send(code)
            exports.findCodesFor(clientsWaiting)
          }
        })
      })
      //priority validate codes we have before giving them away and popping it
    } else {
      resp.send("No codes available, please check back soon.")
      exports.findCodesFor(clientsWaiting)
                        //remove them from the restricted list
    }
  } else {
    // isPValidatorLoggedIn = false
    exports.isFindingCodes = false
    exports.writeCodesToDisk() //overrwrite data
    console.log("No more clients waiting for codes")
  }
}

exports.reloadDriver = function() {
  driver.manage().deleteAllCookies()
}
