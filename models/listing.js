const { default: mongoose } = require("mongoose");
let Schema = mongoose.Schema;
let Review = require("./review.js");
const { ref, string } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: String,
  image: {
    url: String,
    filename: String,
  },
  instructions: String,
  servings: Number,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;
