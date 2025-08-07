const Razorpay = require('razorpay');

var razorpayinstance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID,
  key_secret: process.env.Razorpay_KEY_SECRET,
});

module.exports = razorpayinstance;