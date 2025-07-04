const express = require("express");
const { UserAuth } = require("../middlewares/adminAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connect } = require("mongoose");
const userRoute = express.Router();

const Request_User_Populate = "firstName lastName photoUrl gender about skills";

userRoute.get("/user/requests/received", UserAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connectionRequestReceived = await connectionRequest
      .find({
        receiverUserId: loggedInUserId._id,
        status: "interested",
      })
      .populate({ path: "senderUserId", select: Request_User_Populate });

    res.json({
      message: "Received connection requests",
      user: connectionRequestReceived,
    });
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

userRoute.get("/user/requests/sent", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const ConnectionRequestSent = await connectionRequest
      .find({
        senderUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("receiverUserId", Request_User_Populate);

    res.json({
      message: "Sent connection requests",
      user: ConnectionRequestSent,
    });
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

userRoute.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userConnections = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedInUser._id, status: "accepted" },
          { receiverUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("senderUserId", Request_User_Populate)
      .populate("receiverUserId", Request_User_Populate);

    const data = userConnections.map((connection) => {
      if (
        connection.senderUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.receiverUserId;
      }
      return connection.senderUserId;
    });

    res.json({
      message: "connections",
      data: data,
    });
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

userRoute.get("/feed", UserAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    // which user to show in feed -
    // 1. Exclude the logged in user
    // 2. Exclude the users with whom logged in user has sent the connection request or accepted connection request
    // 3. Exclude the users which are already either we ignored or rejected by the logged in user or  the user has ignored or rejected the logged in user

    // this will receive all the connection requests sent by the logged in user and received by the logged in user - interested or ignored or accepted or rejected
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedInuser._id },
          { receiverUserId: loggedInuser._id },
        ],
      })
      .select("senderUserId receiverUserId");

    // this will create a set of user ids which are to be hidden from the feed - unique user ids stored in a set
    const hideuserfromfeed = new Set();
    connectionRequests.forEach((req) => {
      hideuserfromfeed.add(req.senderUserId.toString());
      hideuserfromfeed.add(req.receiverUserId.toString());
    });

    // this will filter the user ids which are to be hidden from the feed -
    // 1. logged in user id
    // 2. hideuserfromfeed set which contains the user ids of the users with whom logged in user has sent the connection request or accepted connection request or ignored or rejected the connection request
    const feedUsers = await User.find({
      $and: [
        { _id: { $ne: loggedInuser._id } },
        { _id: { $nin: Array.from(hideuserfromfeed) } },
      ],
    }).select(Request_User_Populate);

    res.json({
      message: "Feed data",
      data: feedUsers,
    });
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

module.exports = userRoute;
