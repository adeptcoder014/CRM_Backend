// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);

// app.use(express.static(`${__dirname}/public`));
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("join", (room) => {
//     socket.join(room);
//     console.log(`Client joined room ${room}`);
//   });

//   socket.on("leave", (room) => {
//     socket.leave(room);
//     console.log(`Client left room ${room}`);
//   });

//   socket.on("sendMessage", (room, message) => {
//     socket.to(room).emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// server.listen(3001, () => {
//   console.log("Listening on port 3690");
// });


const accountSid = 'ACcf8c93ae71f55db19c8302369929b845'; // Your Account SID from www.twilio.com/console
const authToken = '5ec3fc2ee913c8147dd1062530c1138b'; // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello Adept coder !',
    to: '7392988369', // Text this number
    from: '+18457123625', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
