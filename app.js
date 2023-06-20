const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const errorHandler = require("./middleware/error_handling_middleware");
const cookieParser = require("cookie-parser");

const port = config.get("port");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mainRouter);

// Albatta xatoni oxirida tekshirish kerak
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(port, () => {
      console.log(`Server ${port}-portda ishga tushdi`);
    });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

start();
