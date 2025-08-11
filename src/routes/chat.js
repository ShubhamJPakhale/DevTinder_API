const express = require("express");
const { UserAuth } = require("../middlewares/adminAuth");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  // find if userId and targetUserId are friend or not - if not then don't store the message
  const isFriend = await ConnectionRequest.findOne({
    $or: [
      { senderUserId: userId, receiverUserId: targetUserId, status: "accepted" },
      { senderUserId: targetUserId, receiverUserId: userId, status: "accepted" },
    ],
  });

  if (!isFriend) return res.send("you are not mutual connection !!");

  // find the chat between userId and targetUserId fron db if found -
  let chat = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  }).populate({ path: "message.sender", select: "firstName lastName" });

  if (!chat) {
    chat = new Chat({
      participants: [userId, targetUserId],
      message: [],
    });

    await chat.save();
  }

  res.json(chat);
});

module.exports = chatRouter;
