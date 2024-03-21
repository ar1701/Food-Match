const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");


router.post("/", isLoggedIn, reviewController.newReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
