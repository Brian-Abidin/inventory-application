const { Router } = require("express");
const usersController = require("../controller/usersController");

const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/games", usersController.getGames);
usersRouter.get("/categories", usersController.getCategories);
usersRouter.get("/games/:id", usersController.getGameDetails);
usersRouter.get("/search", usersController.getSearch);
usersRouter.get("/search/genre", usersController.getGamesByGenre);
usersRouter.get("/search/dev", usersController.getGamesByDev);
usersRouter.get("/edit/:id", usersController.getEditGame);
usersRouter.post("/edit", usersController.postEditGame);
usersRouter.get("/new", usersController.getNewGame);
usersRouter.post("/new", usersController.postNewGame);
usersRouter.post("/delete", usersController.postDeleteGame);

module.exports = usersRouter;
