require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const { Server } = require("socket.io")

const httpServer = require("http").createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN
    }
})

app.use((req, _res, next) => {
    req.io = io;
    next();
})

require('./routes/socket.routes')(io)



require('./routes')(app)

require("./error-handling")(app);

module.exports = { app, httpServer, io }
