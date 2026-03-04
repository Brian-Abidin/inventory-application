const { Router } = require("express");
const uploadController = require("../controller/uploadController");
const usersController = require("../controller/usersController");
const authMiddleware = require("../middleware/admin");

const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/games", usersController.getGames);
usersRouter.get("/categories", usersController.getCategories);
usersRouter.get("/games/:id", usersController.getGameDetails);
usersRouter.get("/search", usersController.getSearch);
usersRouter.get("/search/genre", usersController.getGamesByGenre);
usersRouter.get("/search/dev", usersController.getGamesByDev);
usersRouter.get("/edit/:id", authMiddleware, usersController.getEditGame);
usersRouter.post("/edit", authMiddleware, usersController.postEditGame);
usersRouter.get("/new", usersController.getNewGame);
usersRouter.post(
  "/new",
  uploadController.upload.single("image"),
  usersController.postNewGame
);
usersRouter.post("/delete", authMiddleware, usersController.postDeleteGame);

module.exports = usersRouter;
