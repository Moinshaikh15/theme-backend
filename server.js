const express = require('express');
const http = require('http');
const { Server, socketIo } = require('socket.io');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require("./router/auth");
const themeRouter = require("./router/theme")

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());

let httpServer = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening on port ${process.env.PORT || 5000}`);
});

const io = new Server(httpServer, { cors: { origin: "*" } });

app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.use("/auth", authRouter);
app.use("/theme", themeRouter)


// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
});


