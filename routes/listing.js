const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");


const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

//Index Route
router.get("/", listingController.index);



router
  .route("/new")
  .get(isLoggedIn, listingController.newListing)
  .post(upload.single('list[image]'), listingController.createListing)
  

router.route("/:id").get(listingController.showListing);

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, listingController.renderEditForm)
  .put(isLoggedIn, isOwner, listingController.updateListing);

//Delete Route
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  listingController.deleteListing
);

module.exports = router;
