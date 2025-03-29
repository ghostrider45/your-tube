const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    let users = {};

    io.on('connection', (socket) => {
        socket.on("join", (userId) => {
            users[userId] = socket.id;
        });

        socket.on("callUser", (data) => {
            io.to(users[data.userToCall]).emit("callUser", {
                signal: data.signalData,
                from: data.from
            });
        });

        socket.on("acceptCall", (data) => {
            io.to(users[data.to]).emit("callAccepted", data.signal);
        });

        socket.on("disconnect", () => {
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            if (userId) {
                delete users[userId];
            }
        });
    });

    return io;
};