const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const WebSocketServer = require("ws").Server;

const corsOptions = {
  origin: ["http://localhost:8080"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

// db.sequelize.sync();

// never enable the code below in production
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   // initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// routes
require("./app/routes/exampleRoutes")(app);

// const http = require('http')
const port = 4000
const serverWs = http.createServer(app)
const interval = 180000 

// serverWs.listen(port, () => {
//   console.log(`Websocket server is running on port: ${port}`)
// })



const wss = new WebSocketServer({server: serverWs})

wss.on('connection', () => {
  fetchData();
  const intervalFetch = setInterval(exampleController.callmeWebSocket, interval);

  connection.on('close', () => {
    clearInterval(intervalFetch)
    console.log('Connection closed')
  })
})

// const exampleController = require("./app/controllers/exampleController")
// exampleController.callmeWebSocket('echo')

// set port, listen for requests
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
