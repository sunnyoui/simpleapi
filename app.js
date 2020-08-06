var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
const fs = require('fs');
var https = require('https');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const proxy = require("node-global-proxy").default;

proxy.setConfig({
  http: "http://fastweb.int.bell.ca:8083",
  //https: "https://fastweb.int.bell.ca:8083",
});
proxy.start();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(8888, function () {
    console.log("app running on port.", server.address().port);
});
