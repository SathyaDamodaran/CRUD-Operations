const express = require("express");
const router = express.Router();

let id = 5;
let products = [
  { id: 1, title: "Orange", price: 15, stock: 55, quantity: 0 },
  { id: 2, title: "Banana", price: 40, stock: 30, quantity: 0 },
  { id: 3, title: "Grapes", price: 25, stock: 60, quantity: 0 },
  { id: 4, title: "Apples", price: 45, stock: 0, quantity: 0 },
  
];

let cart = [];

router.get("/", function(req, res, next) {
  res.render("products/list", { products: products });
});

router.get("/add", function(req, res, next) {
  res.render("products/add");
});

router.post("/add", function(req, res, next) {
  let product = req.body;
  if (product.stock > 0) {
    product.id = ++id;
    products.push(product);
    let success = "Sucessfully Added Product to the list";
    res.render("products/add", { success });
  } else {
    let error = "stock cannot be <= 0";
    res.render("products/add", { product, error });
  }
});

router.get("/edit/:id", function(req, res) {
  let id = req.params.id;
  let idx = products.findIndex(p => p.id == id);
  res.render("products/add", { product: products[idx], edit: true });
});

router.post("/edit/:id", function(req, res) {
  let product = req.body;
  let id = req.params.id;
  let idx = products.findIndex(p => p.id == id);
  product.id = id;
  products[idx] = product;
  res.redirect("/products");
});

router.get("/del/:id", function(req, res) {
  let id = req.params.id;
  let deletemsg;
  let idx = products.findIndex(p => p.id == id);
  products.splice(idx, 1);
  deletemsg = "Successfully Deleted Product" + " " + id;
  res.render("products/list", { products, deletemsg });
});

// router.get("/addProduct/:id", function(req, res) {
//   let id = req.params.id;
//   let idx = products.findIndex(p => p.id == id);
//   console.log(products[idx].title);

//   let quantity = 0;
//   let a = 0;
//   let successMsg =
//     "Successfully Added Product" + " " + (idx + 1) + " " + "to the Cart";
//   if (cart.length > 0) {
//     console.log(1);
//     if (products[idx].title == cart[idx].title) {
//       console.log(2);
//       a = quantity + 1;
//       cart[idx].quantity = a;
//       console.log(cart[idx].quantity);
//     } else {
//       console.log(3);
//       cart.push(products[idx]);
//     }
//   } else {
//     console.log(4);
//     cart.push(products[idx]);
//   }

//   products[idx].stock = products[idx].stock - 1;
//   res.render("products/list", { products, successMsg });
// });

// router.get("/remove/:id", function(req, res) {
//   let id = req.params.id;
//   let deletemsg;
//   let idx1 = cart.findIndex(p => p.id == id);
//   cart.splice(idx1, 1);
//   let idx2 = products.findIndex(p => p.id == id);
//   products[idx2].stock = products[idx2].stock + 1;
//   deletemsg = "Successfully Removed Product" + " " + id + " " + "from the Cart";
//   res.render("products/cart", { cart, deletemsg });
// });

router.get("/addProduct/:id", function(req, res) {
  let id = req.params.id;
  let index = products.findIndex(p => p.id == id);
  let successMsg =
    "Successfully Added Product" + " " + (index + 1) + " " + "to the Cart";
  products[index].quantity++;
  if (products[index].quantity > 0) {
    let index1 = cart.findIndex(p => p.id == id);
    if (index1 != -1) {
      cart[index1] = products[index];
    } else {
      cart.push(products[index]);
    }
  }
  
  res.render("products/list", { products, successMsg });
});

router.get("/remove/:id", function(req, res) {
  let id = req.params.id;
  let deletemsg;
  let index1 = cart.findIndex(p => p.id == id);
  cart[index1].quantity--;
  if (cart[index1].quantity > 0) {
    let index2 = products.findIndex(p => p.id == id);
    products[index2] = cart[index1];
  } else if (cart[index1].quantity == 0) {
    cart.splice(index1, 1);
  }
  if (cart.length == 0) {
    let emptyCart = "Cart is Empty";
    res.render("products/cart", { cart, emptyCart });
  }
  let idx2 = products.findIndex(p => p.id == id);
  products[idx2].stock = products[idx2].stock + 1;
  deletemsg = "Successfully deleted" + " " + id;
  res.render("products/cart", { cart, deletemsg });
});

router.get("/cart", function(req, res, next) {
  let cartMsg;
  if (cart.length == 0) {
    cartMsg = "Cart is empty";
  } else {
    cartMsg = " ";
  }
  res.render("products/cart", { cart, cartMsg });
});

module.exports = router;
