const express = require("express");
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");
require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// used to use static files in the public folder
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));

// used to parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// uses usersRouter to route all views and display them in app
app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening to port ${PORT}!`));
