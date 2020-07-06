const fs= require('fs')
const config = require("./config")
const express = require("express")
const bodyParser = require("body-parser")
const db = require("./db")
const env = process.env
const app = express()
const https = require('https')

// importing the routes
const indexRoutes = require("./routes/index.js") 
const userRoutes = require("./routes/users.js")
const linkRoutes= require("./routes/links.js")
const authRoutes= require("./routes/auths")
const callbackRoutes= require("./routes/callbacks")


const crendential={};

// checking if project is running in production mode
if(config.mode==="2"){
 credentials = {
  key: fs.readFileSync(config.keyPem),
  cert: fs.readFileSync(config.certPem),
  ca: fs.readFileSync(config.caPem)
 };
}


db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,Authorization, X-Requested-With, Content-Type, Accept, Cache-Control, Expires, Pragma");
  res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  next();
});

app.use("/", indexRoutes);
app.use("/users",userRoutes);
app.use("/link",linkRoutes);
app.use("/auth",authRoutes);
app.use("/callback",callbackRoutes);

if(config.mode==="2"){
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(env.NODE_PORT || 3000, env.NODE_IP || '0.0.0.0', function () {
    console.log(`Application worker ${process.pid} started...`);
  });
}else{
  app.listen(env.NODE_PORT || 3000, env.NODE_IP || '0.0.0.0', function () {
    console.log(`Application worker ${process.pid} started...`);
  });
}
