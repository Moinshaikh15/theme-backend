const express = require('express');
const { Server } = require('socket.io');
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
    //console.log('A user connected');
    socket.on("theme_check", (message) => {
      
        let userId = message.userId
        socket.join(userId)

        let query = 'SELECT * FROM \"THEME_PREFERENCE\" WHERE user_id = $1'
        let values = [userId]
        dbPool.query(query, values, (error, result) => {
           
            if (error) {
                console.error('Error updating theme preference:', error);
            } else {
                if (result.rows.length > 0) {
                    const themePreference = result.rows[0];
                    
                    socket.emit('theme-updated', themePreference);
                } else {

                    //send a default theme preference
                    const defaultTheme = {
                        primary_colour: '#ffffff',
                        secondary_colour: '#000000',
                        text_colour: '#000000',
                        font_size: 16,
                        font: 'Arial',
                        user_id: userId,
                    };
                    socket.emit('theme-updated', defaultTheme);
                }
            }

        })
    })
});

