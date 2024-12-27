const express = require("express");
const reviewController = require("../controllers/reviews_controller");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const reviews = express.Router();

reviews.post("/createReview", verifyToken, reviewController.createReviews);
reviews.get("/findAllReviews", verifyToken, reviewController.getAllReviews);
reviews.get("/findReviewById/:id", verifyToken, reviewController.getReviewById);
reviews.get(
  "/findReviewByUser/:id",
  verifyToken,
  adminMiddleware,
  reviewController.getReviewByUser
);
reviews.get(
  "/findReviewByUsername/:username",
  verifyToken,
  adminMiddleware,
  reviewController.getReviewByUsername
);
reviews.put(
  "/updateReview/:id",
  verifyToken,
  adminMiddleware,
  reviewController.updateReview
);
reviews.delete(
  "/deleteReview/:id",
  verifyToken,
  adminMiddleware,
  reviewController.deleteReview
);

module.exports = reviews;
