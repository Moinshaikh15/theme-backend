const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require("./router/auth");
const themeRouter = require("./router/theme")

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Middleware
app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use("/theme", themeRouter)


// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
