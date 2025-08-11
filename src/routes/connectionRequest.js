const express = require("express");
const connectionRequestRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const { UserAuth } = require("../middlewares/adminAuth");
const User = require("../models/user");

// the above should required to send the email to user if we host our application to somewhere on domain name which has dns network then we can use this
//const sendEmail = require("../utils/sendEmail");

connectionRequestRoute.post(
  "/request/send/:status/:ReceiverUserId",
  UserAuth,
  async (req, res) => {
    try {
      const senderUserId = req.user._id;
      const receiverUserId = req.params.ReceiverUserId;
      const status = req.params.status;

      // to check the allowed status only send in request - status validation
      const allowedstatus = ["ignored", "interested"];
      if (!allowedstatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      // if existing connection request exist with both case a to b or b to a - it should be only one request exist
      const isexistingconnectionrequ = await ConnectionRequest.findOne({
        $or: [
          { senderUserId, receiverUserId },
          { senderUserId: receiverUserId, receiverUserId: senderUserId },
        ],
      });

      if (isexistingconnectionrequ) {
        return res
          .status(400)
          .json({ message: "Connection request already Exists !!" });
      }

      // check if user sent receiverid exist in my db or not
      const userexists = await User.findById(receiverUserId);

      if (!userexists) {
        return res.status(400).json({ message: "user not found !!" });
      }

      // if user is trying to sent connection request to himself - this code or pre code from schema same only
      //   const isusersendingreqtoself = senderUserId !== receiverUserId;
      //   if(isusersendingreqtoself)
      //   {
      //     return res.status(400).json({message:"User can't sent request to self !!"})
      //   }

      const connectionrequestdata = new ConnectionRequest({
        senderUserId,
        receiverUserId,
        status,
      });

      await connectionrequestdata.save();

      // we can pass dynamic data to email template - in run function - that we will access in sendEmail.js
      //const sendEmailtoUser = await sendEmail.run();

      const sendername = req.user.firstName;
      const receivername = userexists.firstName;

      const messagetouser =
        status === "interested"
          ? `${sendername} is interested in ${receivername}`
          : status === "ignored"
          ? `${sendername} has ignored ${receivername}`
          : `${sendername} has status: ${status}`;

      res.status(200).json({ message: messagetouser });
    } catch (err) {
      res.status(400).send(`Error - ${err.message}`);
    }
  }
);

connectionRequestRoute.post("/request/review/:status/:ReceiverUserId", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const {status, ReceiverUserId} = req.params;

    const allowedstatus = ["accepted", "rejected"];
    if(!allowedstatus.includes(status))
    {
      return res
          .status(400)
          .json({ message: "Invalid status type " + status });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: ReceiverUserId,
      status: "interested",
      receiverUserId: loggedInUser._id
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    const updateddata = await connectionRequest.save();

    res.status(200).json({message: `Connection request ${status} successfully`, data: updateddata});
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

module.exports = connectionRequestRoute
