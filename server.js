// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
const isNumeric = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// returns a json object with unix key = timestamp of input date in milliseconds
// and utc key = input date in format "Thu, 01 Jan 1970 00:00:00 GMT"
app.get("/api/timestamp/:date?", (req, res, next) => {
  req.utc = new Date();
  let currentTime = new Date(req.params.date);
  if (isNumeric(req.params.date)) {
    req.utc = new Date(parseInt(req.params.date));
  } else if ((req.params.date != undefined && currentTime) instanceof Date) {
    req.utc = new Date(Date.parse(currentTime));
  }
  req.unix = Date.parse(req.utc);
  next();
}, (req, res) => {
  if (req.utc.toString() === "Invalid Date" && req.params.date != undefined) {
    res.status(200).json({ "error": "Invalid Date" })
  }
  res.status(200).json({ "unix": req.unix, "utc": req.utc.toUTCString() });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
