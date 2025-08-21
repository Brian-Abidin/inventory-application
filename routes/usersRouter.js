const { Router } = require("express");
const usersController = require("../controller/usersController");

const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);

module.exports = usersRouter;
