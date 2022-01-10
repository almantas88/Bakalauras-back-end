const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < array.length; i++) {
  const element = array[i];
  if (element % 15 === 0) {
    console.log("fizzbuzz");
  } else if (element % 5 === 0) {
    console.log("buzz");
  } else if (element % 3 === 0) {
    console.log("fizz");
  } else {
    console.log(element);
  }
}
