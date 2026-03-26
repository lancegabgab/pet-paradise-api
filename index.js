require('dotenv').config();
const express = require("express");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const connectDB = require("./config/mongoose");

const port = process.env.PORT;

const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.listen(port, () => {
	console.log(`Port is running at ${port}`)
})

