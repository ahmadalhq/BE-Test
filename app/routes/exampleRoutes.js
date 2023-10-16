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

  // router.get(
  //   "/",
  //   [exampleMiddleware.exampleMiddleware],
  //   exampleController.exampleFunction
  // );

  // router.get(
  //   "/",
  //   [exampleMiddleware.exampleMiddleware],
  //   exampleController.exampleFunction
  // );

  router.get(
    "/get-survey",
    exampleController.refactoreMe1
  )

  router.get(
    "/get-data",
    exampleController.getData
  )

  router.post(
    "/do-survey",
    exampleController.refactoreMe2
  )

  app.use("/api/data", router);
};
