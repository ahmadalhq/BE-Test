// const WebSocketServer = require("ws").Server;
const { default: axios } = require("axios");
const db = require("../models");
const express = require("express");
const app = express();
const http = require('http');
const redis = require('redis');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const jwt = require('jsonwebtoken');
const configAuth = require('../config/auth');

const redisClient = redis.createClient();

// const Model = db.Model;
// const { Op } = require("sequelize");

exports.refactoreMe1 = (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
  db.sequelize.query(`select * from "surveys"`).then((data) => {
    let resp = data[0]
    const totalIndex = resp.map(e => e.values.reduce((a, b) => a + b, 0) / 10)
    res.status(200).send({
      statusCode: 200,
      success: true,
      data: totalIndex,
    });
  });
};

exports.refactoreMe2 = (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  let date = new Date();
  let createdAt = date.toISOString()
  let updatedAt = date.toISOString()
  db.sequelize.query(`INSERT INTO surveys ("userId", "values", "createdAt", "updatedAt") VALUES (${req.body.userId}, '{${req.body.values}}', '${createdAt}', '${updatedAt}')`)
    .then((data) => {
      db.user.update(
        {
          dosurvey: true,
        },
        {
          where: { id: req.body.userId },
        }
      )
        .then(() => {
          console.log("success");
        })
        .catch((err) => console.log(err));

      res.status(201).send({
        statusCode: 201,
        message: "Survey sent successfully!",
        success: true,
        data: {
          userId: req.body.userId,
          values: req.body.values
        } ,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        message: "Cannot post survey.",
        success: false,
      });
    });
};

const fetchData =  async () => {
  const url = 'https://livethreatmap.radware.com/api/map/attacks?limit=10'

  try {
    const response = await axios.get(url);
    const attacks = response.data;
    return attacks
  } catch(error) {
    console.error('Error fetching data', error);
  }
}

const callmeWebSocket = async () => {
  // do something
  try {
    const cachedData = await new Promise((resolve, reject) => {
      redisClient.get('attacksData', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    let attacks;

    if (cachedData) {
      attacks = JSON.parse(cachedData);
      console.log('Data retrieved from Redis cache');
    } else {
      attacks = await fetchData();
      redisClient.setex('attacksData', 180, JSON.stringify(attacks));
      console.log('Data fetched and stored in Redis cache');
    }

    const dataToSend = JSON.stringify(attacks);

    db.attack.destroy({
      where: {}
    })
    for (i = 0; i < attacks.length; i++) {
      attacks[i].forEach(value => {
        db.attack.create({
          sourceCountry: value.sourceCountry,
          destinationCountry: value.destinationCountry,
          millisecond: value.millisecond,
          type: value.type,
          weight: value.weight,
          attackTime: value.attackTime
        })
      });
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataToSend);
      }
    });
  } catch (error) {
    console.error('Failed to fetch and send data:', error.message);
  }
};

exports.websocket = () =>{
  callmeWebSocket();
  const fetchDataInterval = setInterval(callmeWebSocket, 180000);

  wss.on('connection', (ws) => {
    console.log('A new client connected');
    ws.send('Welcome to the WebSocket server!');
  });

  const PORT = 4000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

exports.getData = (req, res) => {
  // do something
  let labelTemp = new Set()
  let labelArray = []
  let valTemp = []

  db.sequelize.query(`SELECT * FROM "attacks"`).then((result) => {
    let resp = result[0]
    for (const val of resp) {
      if (!labelTemp.has(val['type'])) {
        labelTemp.add(val['type']);
        labelArray.push(val['type'])
      }
    }
    for (i = 0; i < labelArray.length; i++) {
      db.sequelize.query(`SELECT COUNT(id) FROM "attacks" WHERE attacks.type = '${labelArray[i]}'`)
        .then((response) => {
          valTemp.push(response[0][0].count * 1)
          if (valTemp.length == labelArray.length) {
            res.status(200).json({
              success: true,
              statusCode: 200,
              data: {
                label: labelArray,
                value: valTemp
              }
            })
          }
        })
    }
  })
  .catch(error => {
    console.log(error)
  })
};

exports.Login = (req, res) => {
  const payload = req.body
  const token = jwt.sign(payload, configAuth.secret)

  return res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      message: 'success login',
      token: token
    }
  })
}