const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Book = require("../models/book.model");

router.post("/newBook", auth, async (req, res) => {
    console.log(req.body);
  try {
    let { title, author, description, bookID } = req.body;
    if (!title || !author || !bookID) {
      return res.status(400).json({ msg: "Ne visi laukai buvo užpildyti." });
    }

    const existingBookID = await Book.findOne({ bookID: bookID });
    if (existingBookID)
      return res
        .status(400)
        .json({ msg: "Knyga su tokia knygos ID jau egzistuoja." });

    const newBook = new Book({
      title,
      author,
      description,
      bookID,
    });
    const savedBook = await newBook.save();
    res.status(200).json({ msg: "Knyga sukurta!" });
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
      return res.status(400).send({ msg: "Ne visi laukai buvo užpildyti." });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .send({ msg: "Nėra tokio vartotojo su tokiu el. paštu." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).send({ msg: "Netinkami prisijungimo duomenys." });
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
// cia butinai reiks dar patikrinti ar dar neliko pas ji knygu, jeiguy dar turi kad neleistu istrinti
router.delete("/deleteBook", auth, async (req, res) => {
  try {
    const existingBook = await Book.findOne({ bookID: req.body.bookID });
    if (!existingBook)
      return res
        .status(400)
        .json({ msg: "Nera tokios knygos su tokia knygos ID." });

    const deletedBook = await Book.deleteOne({ bookID: req.body.bookID });
    res.json({ msg: "Knyga sėkmingai ištrinta!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/allBooks", auth, async (req, res) => {
  try {
    const allBooks = await Book.find().sort({
      title: "asc",
    });
    return res.status(200).send({
      books: allBooks,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/oneUser", auth, async (req, res) => {
  try {
    const foundUser = await User.findOne({ cardID: req.body.cardID });
    if (!foundUser)
      return res.status(400).send({ msg: "Vartotojas neegzistuoja" });
    return res.status(200).send({
      user: foundUser,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.put("/updateUser", auth, async (req, res) => {
  try {
    console.log(req.body);
    let { email, firstName, lastName, cardID, grade, password, passwordCheck } =
      req.body;

    if (!email || !firstName || !lastName || !cardID || !grade) {
      return res.status(400).json({ msg: "Ne visi laukai buvo užpildyti." });
    }
    const foundUser = await User.findOne({ cardID: req.body.cardID });
    if (!foundUser)
      return res.status(400).send({ msg: "Vartotojas neegzistuoja" });

    const newUserInfo = {
      email,
      firstName,
      lastName,
      cardID,
      grade,
    };

    if (password && passwordCheck) {
      if (password !== passwordCheck) {
        return res.status(400).json({ msg: "Slaptažodžiai nesutampa." });
      }
      if (password.length < 5)
        return res
          .status(400)
          .json({ msg: "Slaptažodis turi būti bent 5 raidžių ilgio." });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      newUserInfo.password = passwordHash;
    }

    const updatedUser = await User.findOneAndUpdate(
      { cardID: req.body.cardID },
      newUserInfo
    );

    return res.status(200).json({
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
