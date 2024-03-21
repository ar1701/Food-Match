const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema({
 title:String,
 ingredients: String,
 servings: String,
 instructions: String,
  
});

const Food = new mongoose.model("Food", foodSchema);
module.exports = Food;