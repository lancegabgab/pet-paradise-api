require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const port = process.env.PORT;

const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(process.env.CONN_STRING, 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.listen(port, () => {
	console.log(`Port is running at ${port}`)
})

