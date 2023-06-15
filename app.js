const express = require("express");
const config = require("config");
const { errorHandler } = require("./helpers/error_handler");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");

const port = config.get("port");

const app = express();

app.use(express.json());

app.use(mainRouter);

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
