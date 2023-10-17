const db = require("../models");
const config = require("../config/auth");
// const model = db.model;
const jwt = require('jsonwebtoken');

exampleMiddlewareFunction = (req, res, next) => {
  // do something
  token = req.headers.token
  try {
    var decoded = jwt.verify(token, config.secret);
    if (decoded.role == "admin" || decoded.role == "user") {
      next();
    } else {
      res.status(401).send({
        statusCode: 401,
        message: "User unauthorized.",
        success: false,
      });
    }
  } catch(err) {
    return next(err);
  }
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
};

module.exports = verify;
