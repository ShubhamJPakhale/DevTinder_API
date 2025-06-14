const express = require("express");
const { connecttoDB } = require("./config/database");
const User = require("./models/user");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// signup post data to the user inside DB -
app.post("/signup", async (req, res) => {
  //create instance of User model to inset the data in to MondoDB
  const userdata = new User(req.body);
  try {
    await userdata.save();
    res.send("User data added successfully inside DB !!");
  } catch (err) {
    res.status(400).send(`Error while saving data to the DB: ${err.message}`);
  }
});

// get the user by emailId
app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(404).send("user with the above email id not found !!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

// get the user by firstName - findOne
app.get("/userfn", async (req, res) => {
  const userfirstname = req.body.firstName;

  try {
    const users = await User.findOne({ firstName: userfirstname });
    if (users.length === 0) {
      res.status(404).send("user with the above firstName not found !!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

// get user by id
app.get("/user/:id", async (req, res) => {
  const userid = req.params.id;

  try {
    const users = await User.findById(userid);
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

// get user by id and delete it from db
app.delete("/user/:id", async (req, res) => {
  const userid = req.params.id;

  try {
    const users = await User.findByIdAndDelete(userid);
    res.status(200).send("user deleted from db successfully !!");
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

// update the user information by id
app.patch("/user", async (req, res) => {
  const userid = req.body._id;
  const data = req.body;
  try {
    const users = await User.findByIdAndUpdate({ _id: userid }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!users) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User updated successfully");
  } catch (err) {
    res.status(400).send("updated error - "+err.message);
  }
});

// NOTE - we can not use same route with two different condition in code - use distinguish endpoint for each
// update the user information whose first matching document has emailId
// app.patch("/user", async (req, res) => {
//   const useremailId = req.body.emailId;
//   const updateData = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { emailId: useremailId },
//       { $set: updateData },
//       {
//         returnDocument: "after",
//         runValidators: true,
//       }
//     );

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).send("Update failed: " + err.message);
//   }
// });

// update the user information whose first matching document has firstName
app.patch("/userfn/:firstName", async (req, res) => {
  const userfirstname = req.params.firstName;
  const updateData = req.body;

  try {
    if (updateData.emailId) {
      const existingEmail = await User.findOne({ emailId: updateData.emailId });
      if (existingEmail && existingEmail.firstName !== userfirstname) {
        return res.status(409).send("Email already exists!");
      }
    }

    const user = await User.findOneAndUpdate(
      { firstName: userfirstname },
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

// get the all the user from db
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(404).send("No data found in db");
  }
});

connecttoDB()
  .then(() => {
    console.log("Database connection established successfully !!");
    app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection not established..please try again.. !!");
  });
