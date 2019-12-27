const app = require("./backend/app");
 // debug and http are packages shipping with node, so we don't need to install them
const debug = require("debug")("node-angular");
const http = require("http");

// makes sure that when we try to set up a port, the port is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// check which type of error occurred and exit gracefully from the node.js server
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// logs that we're now listening to oncoming requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// process.env.PORT gets the hosting provider's default port. If they haven't set one,
// it'll go to port 3000. You can also pass in 3000 as a number instead of a string,
// but process.env.PORT is usually a string so we made 3000 a string as well
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app); // set up node.js server
server.on("error", onError); // finds out if there was an error
server.on("listening", onListening); // tells us if everything went smoothly
server.listen(port); // Starts the server and now we're listening to requests
