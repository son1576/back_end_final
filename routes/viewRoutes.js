const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const bookingController = require('../controllers/bookingController');


const Router = express.Router();

Router.use(viewController.alerts);

Router.get('/', authController.isLoggedIn, viewController.getOverview);
Router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
Router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
Router.get('/signUp', viewController.getSignUpForm);
Router.get('/me', authController.protect, viewController.getAccount);
Router.get('/my-tours', authController.protect, viewController.getMyTours);
Router.get('/my-bookings', authController.protect, viewController.getMyBookings);
Router.get('/my-reviews', authController.protect, viewController.getMyReviews);
Router.get('/my-billings', authController.protect, viewController.getMyBillings);
Router.get('/edit-review/:id', authController.protect, viewController.getEditReview);

Router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
Router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageTours
);

Router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageUsers
);



Router.get(
  '/manage-bookings',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageBookings
);

// manage tour route

Router.get('/manage-tours',authController.protect, tourController.getAllTours);
Router.get('/manage-tours/new-tour',authController.protect, tourController.renderNewTour);
Router.get('/manage-tours/edit/:id',authController.protect, tourController.renderEditTour);
Router.get('/manage-tours/delete/:id',authController.protect, tourController.deleteTour);

Router.post('/manage-tours/create',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.createTour
);

Router.post('/manage-tours/update/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.updateTour
);

Router.post('/manage-tours/delete/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour
);

//manage user route
Router.get('/manage-users',authController.protect, userController.getAllUsers);
Router.get('/manage-users/new-user',authController.protect, userController.renderNewUser);
Router.get('/manage-users/edit/:id',authController.protect, userController.renderEditUser);
Router.get('/manage-users/delete/:id',authController.protect, userController.deleteUser);

Router.post(
  '/manage-users/create',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto, // Upload ảnh
  userController.resizeUserPhoto, // Resize ảnh
  userController.createUser
);

Router.post(
  '/manage-users/update/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto, // Upload ảnh nếu có
  userController.resizeUserPhoto, // Resize ảnh nếu có
  userController.updateUser
);

Router.post(
  '/manage-users/delete/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.deleteUser
);

//manage review route
Router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageReviews
);
Router.post('/manage-reviews/delete/:id', reviewController.deleteReview);

// Route payment
Router.post('/payment', authController.protect, bookingController.payment);

module.exports = Router;
