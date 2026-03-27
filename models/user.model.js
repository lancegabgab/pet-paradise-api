const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
	firstName: {
		type: String,
		required: [true, "First name is required"]
	},	
	lastName: {
		type: String,
		required: [true, "Last name is required"]
	},	
	email:{
		type:String,
		required: [true, "Email is required"],
		unique: true
	},
	isAdmin:{
		type:Boolean,
		default: false
	},
	password:{
		type:String,
		required: [true, "Password is required"]
	},
	mobileNo:{
		type:String,
		required:[true, "Mobile number is required"],
		unique: true
	},
	createdAt:{
		type: Date,
		default: Date.now 
	},
});

module.exports = mongoose.model("User", userSchema);
