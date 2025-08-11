const socket = require("socket.io");
const user = require("../models/user");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const initializeSocketIO = (server) => {
  const secretRoomId = (userId, targetUserId) =>
    crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("&Jij6*&"))
      .digest("hex");

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userFirstName, userId, targetUserId }) => {
      const roomId = secretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ userFirstName, userId, targetUserId, text }) => {
        // store message in the Database -
        try {
          const roomId = secretRoomId(userId, targetUserId);
          // find if userId and targetUserId are friend or not - if not then don't store the message
          const isFriend = await ConnectionRequest.findOne({
            $or: [
              { senderUserId: userId, receiverUserId: targetUserId, status: "accepted" },
              { senderUserId: targetUserId, receiverUserId: userId, status: "accepted" },
            ],
          });

          if (!isFriend) return res.send("you are not mutual connection !!");

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              message: [],
            });

            chat.message.push({ sender: userId, text });

            await chat.save();
          }

          chat.message.push({ sender: userId, text });
          await chat.save();

          io.to(roomId).emit("messageReceived", { userFirstName, text });
        } catch (err) {
          console.error("Error :", err.message);
        }
      }
    );

    socket.on("typing", (room) => {
      socket.to(room).emit("typing", socket.id);
    });

    socket.on("disconnectChat", () => {
      console.log("User disconnected from chat");
    });
  });
};

module.exports = initializeSocketIO;
