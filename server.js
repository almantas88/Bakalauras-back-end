const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const seed = require('./seed');

app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

connectDB();
//seed(1000);
app.use("/users", require("./routes/users"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`back-end server is running on port ${process.env.PORT}`);
});
