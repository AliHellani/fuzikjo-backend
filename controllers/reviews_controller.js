const reviewsRepository = require("../repositories/reviews_repository");
const userRepository = require("../repositories/users_repository");
const validator = require("validator");

async function createReviews(req, res) {
  try {
    const { user_id, rating, comment_ar, comment_en, status } = req.body;

    if (!user_id || !rating) {
      return res
        .status(400)
        .json({ message: "User ID and rating are required" });
    }

    const existingUser = await userRepository.findUserById(user_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviewData = {
      user_id,
      rating,
      comment_ar,
      comment_en,
      status,
    };

    const result = await reviewsRepository.saveReviews(reviewData);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating Review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllReviews(req, res) {
  try {
    const reviews = await reviewsRepository.findAllReviews();

    const language = req.language;
    const filteredReview = reviews.map((review) => ({
      id: review.id,
      user_id: review.user_id,
      rating: review.rating,
      comment: language === "ar" ? review.comment_ar : review.comment_en,
      status: review.status,
      full_name: review.full_name,
    }));

    res.status(200).json({
      message: "Review retrieved successfully",
      ReviewData: filteredReview,
    });
  } catch (error) {
    console.error("Error retrieving Review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await reviewsRepository.findReviewsById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const language = req.language;

    const responseReview = {
      id: review.id,
      user_id: review.user_id,
      rating: review.rating,
      comment: language === "ar" ? review.comment_ar : review.comment_en,
      status: review.status,
      full_name: review.full_name,
    };
    res.status(200).json({
      message: "Review retrieved By ID successfully",
      reviewData: responseReview,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Review By ID",
      details: error.message,
    });
  }
}

async function getReviewByUsername(req, res) {
  try {
    const { username } = req.params;
    if (!username || validator.isEmpty(username)) {
      return res.status(400).json({ message: "Username is required" });
    }

    const usernameReview = await userRepository.findUserByFullName(username);
    if (!usernameReview) {
      return res.status(404).json({ message: "User not found" });
    }
    const reviews = await reviewsRepository.findReviewByUsername(username);

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No Reviews found for this username" });
    }

    const language = req.language;
    const responseReviews = reviews.map((review) => ({
      id: review.id,
      user_id: review.user_id,
      rating: review.rating,
      comment: language === "ar" ? review.comment_ar : review.comment_en,
      status: review.status,
      full_name: review.full_name,
    }));

    res.status(200).json({
      message: "Review retrieved successfully",
      reviewData: responseReviews,
    });
  } catch (error) {
    console.error("Error retrieving Review by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getReviewByUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const userReview = await userRepository.findUserById(id);

    if (!userReview) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await reviewsRepository.findReviewsByUser(id);

    const responseReview = reviews.map((review) => ({
      id: review.id,
      user_id: review.user_id,
      rating: review.rating,
      comment: req.language === "ar" ? review.comment_ar : review.comment_en,
      status: review.status,
      full_name: review.full_name,
    }));

    res.status(200).json({
      message: "Review retrieved successfully",
      reviewData: responseReview,
    });
  } catch (error) {
    console.error("Error retrieving Review by User's:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Review ID" });
    }

    if (!status || validator.isEmpty(status)) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await reviewsRepository.updateReviews(id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review status updated successfully",
      updatedRows: result.updatedRows,
    });
  } catch (error) {
    console.error("Error updating Review status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Review ID" });
    }

    const reviews = await reviewsRepository.findReviewsById(id);
    if (!reviews) {
      return res.status(404).json({ message: "Review not found" });
    }

    const result = await reviewsRepository.deleteReview(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    console.error("Error deleting Review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createReviews,
  getAllReviews,
  getReviewById,
  getReviewByUser,
  getReviewByUsername,
  updateReview,
  deleteReview,
};
