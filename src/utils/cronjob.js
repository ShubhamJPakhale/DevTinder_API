const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

cron.schedule("0 8 * * *", async () => {
    // at 8 AM every day - the cron job will run - will send email to users who have pending connection requests from yesterday
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestOfYesterday = await ConnectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("senderUserId receiverUserId");

    const listofPendingRequests = [
      ...new Set(
        pendingRequestOfYesterday.map((req) => req.receiverUserId.emailId)
      ),
    ];
    console.log(
      "List of pending requests from yesterday:",
      listofPendingRequests
    );

    for (const email of listofPendingRequests) {
      // send email logic here
      try {
        await sendEmail.run(
          "Pending connection request",
          "Your pending connection requests from yesterday"
        );
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error in cron job: ${err.message}`);
  }
});
