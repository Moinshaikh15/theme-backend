const express = require('express');
const http = require('http');
const { Server, socketIo } = require('socket.io');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require("./router/auth");
const themeRouter = require("./router/theme")
const dbPool = require("./dbConfig");

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

    socket.on("theme_check", (message) => {
        let id = message.id

        let query = 'SELECT * FROM \"THEME_PREFERENCE\" WHERE user_id = $1'
        let values = [id]
        dbPool.query(query, values, (error, result) => {
            if (error) {
                console.error('Error updating theme preference:', error);
            } else {
                socket.emit('theme-updated', result.rows[0]);
            }
        })
    })
});

