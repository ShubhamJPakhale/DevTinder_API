const express = require("express");
const { connecttoDB } = require("./config/database");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRoute= require("./routes/profile");
const connectionRequestRoute = require("./routes/connectionRequest");
const userRoute = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
require("./utils/cronjob"); 

// socket.io setup -> 
const http = require("http");
const initializeSocketIO = require("./utils/socket-io");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieparser());


app.use("/",authRouter);
app.use("/",profileRoute);
app.use("/",connectionRequestRoute);
app.use("/",userRoute);
app.use("/",paymentRouter);
app.use("/",chatRouter);

// socket.io code - 
const server = http.createServer(app);
initializeSocketIO(server);

// in below change, app to server for socket.io to work
connecttoDB()
  .then(() => {
    console.log("Database connection established successfully !!");
    server.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection not established..please try again.. !!", err.message);
  });
