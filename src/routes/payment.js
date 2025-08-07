const { ca } = require("date-fns/locale");
const express = require("express");
const { UserAuth } = require("../middlewares/adminAuth");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const User = require("../models/user");
//const razorpayinstance = require("../utils/razorpay");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", UserAuth, async (req, res) => {
  try {

    const { memberShipType, notes } = req.body;

    // NOTE - uncomment the following lines to create an order with Razorpay - if we have secret keys configured

    // const orderdata = await razorpayinstance.orders.create({
    //   amount: 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //   currency: "INR",
    //   receipt: "order_rcptid_11",
    //   notes: {
    //     firstName: req.user.firstName,
    //     lastName: req.user.lastName,
    //     notes,
    //   },
    // });

    const payment = new Payment({
      userId: req.user._id,
      orderId: 211, // orderdata.id,
      paymentId: 211, // orderdata.id,
      status: "created",
      currency: "INR",
      memberShipType,
      notes:{
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        notes: "This is a test payment",
      }
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON()});
  } catch (err) {
    res.status(400).send(`ERROR - ${err.message}`);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("Invalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    console.log("Valid Webhook Signature");
    
    // Update my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved", payment);

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.membershipType;

    await user.save();
    

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify", UserAuth, async (req, res) => {
  const user = req.user.toJSON();
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

module.exports = paymentRouter;
