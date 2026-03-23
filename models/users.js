const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
	firstName: {
		type: String,
		required: [true, "firstName is required"]
	},	
	lastName: {
		type: String,
		required: [true, "lastName is required"]
	},	
	email:{
		type:String,
		required: [true, "email is required"],
		unique: true
	},
	isAdmin:{
		type:Boolean,
		default: false
	},
	password:{
		type:String,
		required: [true, "password is required"]
	},
	mobileNo:{
		type:String,
		required:[true, "mobile number is required"]
	}
});

module.exports = mongoose.model("User", userSchema);
