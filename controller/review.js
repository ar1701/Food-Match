const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.newReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  };