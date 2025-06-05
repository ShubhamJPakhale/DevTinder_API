const express = require("express");

const app = express();
const PORT = 3000;

// In any api type, /user -  will execute the this endpoint
// app.use("/user", (req, res) => {
//   res.send(
//     "irrespective of request to the user endpoint.. this will execute.. order matters.. if we place this at end of code i.e. after all route code then this will only execute when above route matching not found !!"
//   );
// });

// dynamic url reading using query param ->
// app.use('/user',(req,res)=>{
//   console.log('request parameters - ',req.query);
//   //console.log('request parameters - ',JSON.stringify(req.query));
//   res.send('query param get from dynamic url !!')
// })

// GET (/user) => middleware => request handler 

// middleware - 
app.use("/", (req, res, next) => {
  console.log("inside middleware !!")
  next();
});

// request handler - 
app.use(
  "/user",
  (req, res, next) => {
    console.log("1st request handler !!");
    next();
  },
  (req, res, next) => {
    console.log("2nd request handler !!");
    next();
  },
  (req, res, next) => {
    res.send("3rd request handler !!");
  },
  (req, res, next) => {
    res.send("4th request handler !!");
  }
);

// http methods - 
app.get("/user", (req, res) => {
  res.send("Welcome to express node server application !!");
});

app.post("/user", (req, res) => {
  res.send("Data stored to the DB Successfully !!");
});

app.delete("/user", (req, res) => {
  res.send("Record deleted successfully from the DB !!");
});

// port listening client request - 
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
