const { Router } = require("express");
const usersController = require("../controller/usersController");

const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/games", usersController.getGames);
usersRouter.get("/categories", usersController.getCategories);
usersRouter.get("/games/:id", usersController.getGameDetails);
usersRouter.get("/search", usersController.getSearch);

module.exports = usersRouter;
