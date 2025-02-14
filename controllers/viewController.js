const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful! Please check your email for a confirmation. If your booking does not show up here immediatly, please come back later.';
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signUp', { title: 'Sign Up for an account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .render('account', { title: 'Your account', user: updatedUser });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');
  res.status(200).render('bookings', {
    title: 'My Bookings',
    bookings, 
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate('tour');
  res.status(200).render('review', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getEditReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate('tour');

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).render('edit-review', {
    title: 'Edit Review',
    review,
  });
});

// Lấy danh sách các hóa đơn từ Booking
exports.getMyBillings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id, paid: true }).populate('tour');

  res.status(200).render('billings', {
    title: 'My Billings',
    bookings,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('manage-tours', {
    title: 'Manage Tours',
    tours,
  });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manage-users', {
    title: 'Manage Users',
    users,
  });
});

exports.getManageReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('user tour');
  res.status(200).render('manage-reviews', {
    title: 'Manage Reviews',
    reviews,
  });
});

exports.getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().populate('user').populate('tour');
  console.log(bookings); // Kiểm tra dữ liệu
  res.status(200).render('manage-bookings', {
    title: 'Manage Bookings',
    bookings,
  });
});

// function manage user
exports.getCreateUserForm = catchAsync(async (req, res, next) => {
  res.status(200).render('new-user', { title: 'Add New User' });
});

exports.getEditUserForm = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  res.status(200).render('edit-user', {
      title: 'Edit User',
      user
  });
});