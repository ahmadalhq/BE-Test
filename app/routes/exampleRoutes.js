const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.get(
    "/login",
    exampleController.Login
  );

  router.get(
    "/get-survey",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.refactoreMe1
  );

  router.post(
    "/do-survey",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.refactoreMe2
  );

  router.get(
    "/get-data",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.getData
  );
    
  app.use("/api/data", router);
};
