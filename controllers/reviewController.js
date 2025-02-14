const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.redirect('/manage-reviews');
});
exports.updateReview = handlerFactory.updateOne(Review);
exports.getReview = handlerFactory.getOne(Review);
