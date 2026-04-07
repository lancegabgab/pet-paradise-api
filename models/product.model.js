const mongoose = require ("mongoose");
const PET_TYPES = ["dog", "cat", "hamster"];
const CATEGORIES = ["toys", "accessories"];

const productSchema = new mongoose.Schema ({
	name: {
		type: String,
		required: [true, "Name is required"],
		unique: true,
	},
	description: {
		type: String,
		required: [true, "Description is required"]
	},
	petType: [{
		type: String,
		enum: PET_TYPES,
		required: true
	}],
	category: {
		type: String,
		enum: CATEGORIES,
		required: true
	},
	price:{
		type:Number,
		required: [true, `Price is required`]
	},	
	isActive:{
		type:Boolean,
		default: true 
	}
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
