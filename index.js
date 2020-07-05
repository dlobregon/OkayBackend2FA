const fs= require('fs'),
      config = require("./config"),
      express = require("express"),
      bodyParser = require("body-parser"),
      db = require("./db"),
      env = process.env,
      app = express(),
      https = require('https');

// importing the routes
const indexRoutes = require("./routes/index.js"), 
      userRoutes = require("./routes/users.js"),
      linkRoutes= require("./routes/links.js"),
      authRoutes= require("./routes/auths")
      ;

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
