const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        method: ["GET", "POST"],
    },
});

//* this is flag for turn
let isMyTurn = false;

io.on("connection", (socket) => {
    console.log("someone connected with id : " + socket.id);
    let player;
    socket.on("join_room", (data) => {
        socket.join(data.roomCode);
        player = data;
        player.isMyTurn = isMyTurn;
        isMyTurn = !isMyTurn;
        
        //* this send to other player
        socket.to(data.roomCode).emit("set_online", player);

        //* this send to current player logined
        socket.emit("is_my_turn", player);
    });

    socket.on("set_a_button", (data) => {
        socket.to(player.roomCode).emit("get_a_button", data);
    });

    socket.on("send_to_other_player", (data) => {
        socket.to(player.roomCode).emit("get_to_other_player", data);
    });

    socket.on("set_victory", (data) => {
        socket.to(player.roomCode).emit("get_victory", data);
    });

    socket.on("set_equal", () => {
        socket.to(player.roomCode).emit("get_equal");
    });
    socket.on("disconnect", () => {
        if(player){
            socket.to(player.roomCode).emit("set_offline", player);
        }
        console.log("someone disconnected with id: " + socket.id);
    });
});

httpServer.listen(3030, () => {
    console.log("web server run on port 3030");
});
