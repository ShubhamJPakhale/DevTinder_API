const mongoose = require("mongoose");

const ConnectionRequestScehma = new mongoose.Schema({
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    receiverUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values : ["ignored","accepted","rejected","interested"],
            message:`{VALUES} is incorrect status type`
        }
    }
},
{
    timestamps:true
});

ConnectionRequestScehma.pre('save', function(next) {
  const connectionRequest = this;

  if(connectionRequest.receiverUserId.equals(connectionRequest.senderUserId))
  {
    throw new Error("Can't sent connection request to yourself !!")
  }
  next();
});

module.exports = new mongoose.model("ConnectionRequest",ConnectionRequestScehma);