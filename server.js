const express = require("express");
const mongoose = require("mongoose");

app = express();
require("dotenv").config();


  const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true            
        });

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`back-end server is running`);
});