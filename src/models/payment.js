const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "created"],
      default: "created",
    },
    currency: {
      type: String,
      default: "INR",
    },
    memberShipType: {
      type: String,
      required: true,
    },
    notes:{
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        notes: { type: String, default: "No additional notes provided" },
    }
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Payment", paymentSchema);
