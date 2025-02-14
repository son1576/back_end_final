const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');
const Email = require('../utils/email');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.fields([
  { name: 'photo', maxCount: 1 },
]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.files.photo) {
    return next();
  }
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });  
  res.redirect('/manage-users');
});


exports.renderNewUser = (req, res) => {
  res.status(200).render('new-user', {
    title: 'Add New User',
  });
};

exports.renderEditUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).render('edit-user', {
    title: 'Edit User',
    user,
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.redirect('/manage-users'); // Sau khi update, chuyển hướng về trang quản lý tours
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/manage-users');
});

exports.uploadUserImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeUserImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }
});