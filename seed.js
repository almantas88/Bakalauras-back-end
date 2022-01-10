const User = require("./models/user.model");
const faker = require("faker");
const grades = ["1a", "1b", "1c", "2a", "2b", "2c", "3a", "3b", "3c", "4a", "4b", "4c"];
var id = 7000000;

async function seed(limit) {
  for (let index = 0; index < limit; index++) {
      
    try {
      const user = new User({
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: id,
        passwordCheck : id,
        cardID: id,
        role: "STUDENT",
        grade: grades[Math.floor(Math.random() * Math.floor(11))],
      });
      id++;
      await user.save();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = seed;
