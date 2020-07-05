const fs= require('fs'),
      path= require('path'),
      config = require("./config"),
      express = require("express"),
      bodyParser = require("body-parser"),
      //db = require("./db"),
      //authCheckMiddleware = require("./auth/auth-check"),
      env = process.env;

const https = require('https');
const crendential={}
if(config.mode==="2"){
 credentials = {
  key: fs.readFileSync(config.keyPem),
  cert: fs.readFileSync(config.certPem),
  ca: fs.readFileSync(config.caPem)
 };
}

// se obtienen los modulos de las rutas del api.
const indexRoutes = require("./routes/index.js")
      ;
const app = express();

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

if(config.mode==="2"){
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(env.NODE_PORT || 3000, env.NODE_IP || '0.0.0.0', function () {
    console.log(`Application worker ${process.pid} started...`);
  });
  console.log('HTTPS Server listening on %s:%s');
}else
{
  app.listen(env.NODE_PORT || 3000, env.NODE_IP || '0.0.0.0', function () {
    console.log(`Application worker ${process.pid} started...`);
  });
}
