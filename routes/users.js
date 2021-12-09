const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user.model");

//Mokiniu registracija, veliau reiktu gal padaryti ir admino registracija, bet kaip atskira route.
// Register
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, firstName, lastName, cardID, grade } =
      req.body;
    // validate
    if (
      !email ||
      !password ||
      !passwordCheck ||
      !firstName ||
      !lastName ||
      !cardID ||
      !grade
    ) {
      console.log(email, password, passwordCheck, firstName, lastName, cardID);
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      firstName,
      lastName,
      cardID,
      grade,
    });
    const savedUser = await newUser.save();
    res.status(200).json({ msg: "An account was created." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    // validate
    if (!email || !password)
      return res.status(400).send({ msg: "Not all fields have been entered." });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .send({ msg: "No account with this email has been registered." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ msg: "Invalid credentials." });
    const token = jwt.sign(
      {
        id: user._id,
        cardID: user.cardID,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        grade: user.grade,
      },
      process.env.JWT_SECRET
    );
    res.status(200).send({
      token,
      user: {
        cardID: user.cardID,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        grade: user.grade,
      },
    });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

// Delete
router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    id: user._id,
  });
});

router.get("/allUsers",auth, async (req, res) => {
  try {
    const allUsers = await User.find({ role: { $ne: "ADMIN" } }).sort({grade: 'asc'});
    console.log(allUsers);
    res.status(200).send({
      users: allUsers,
    });
  } catch (error) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
