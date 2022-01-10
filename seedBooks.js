const Book = require("./models/book.model");
const faker = require("faker");
var id = 1000000;

async function seed(limit) {
  for (let index = 0; index < limit; index++) {
      
    try {
      const book = new Book({
        title: faker.name.title(),
        author: `${faker.name.firstName()} ${faker.name.lastName()}`,
        description: faker.commerce.productDescription(),
        bookID: id,
      });
      id++;
      await book.save();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = seed;
