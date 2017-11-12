var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // console.log("You are connected!");
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.log("----------------------------")
    console.log("~*~ BAMAZON STORE ~*~")
    console.log("----------------------------")
    for (var i = 0; i < results.length; i++) {
      console.log("Product id: " + results[i].item_id + "\nProduct: " + results[i].product_name + "\nPrice: $" + results[i].price + ".00" + "\n--------------------------");
    };

    askCustomer();
  })
}

function askCustomer() {
  inquirer
    .prompt([
      {
        name: "purchase",
        type: "list",
        message: "What would you like to purchase?",
        choices: ["phone charger", "blender", "head phones", "blanket", "floor lamp", "dish soap", "notesbooks", "hair brush", "ligh bulb", "Macbook Pro"]
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } Î
          return false;

        }
      }
    ])
    .then(function (answer) {

      connection.query(
        "SELECT FROM * products WHERE ?",
        {
          product_name: answer.purchase
        },
        function (err, results) {
          if (results[0].stock_quantity < answer.quantity) {
            console.log("We apologize. There is insuffcient quantity for this order.");

          } else {
            var newQuantity = results[0].stock_quantity - answer.quantity;

            var query = connection.query("UPDATE products SET ? WHERE ?", [
              {
                stock_quantity: newQuantity
              },
              {
                item_id: answer.quantity
              }
            ])
            console.log("Your order is being processed!");
          }
          var bill = answer.quantity * results[0].price;
          console.log("Your total is $" + bill + ".00");

        }
      )
    })
};
