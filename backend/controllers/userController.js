const User = require('../models/userModel');

const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // console.log(req.query);
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  console.log('users ===>', users);

  //EXECUTE QUERY

  const totalUsers = await User.countDocuments();

  console.log('totalUsers ===>', totalUsers);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    totalNoOfUsers: totalUsers,
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Error if user POST password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  //2) filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3)update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { name, email, password, gender, about } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({ name, email, password, gender, about });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  // const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
  // console.log(process.env.JWT_SECRET);
  // const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //   expiresIn: '1h',
  // });

  res.status(201).json({ msg: 'User registered successfully' });
  res.json({ token });
});

// exports.loginUser = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   let user = await User.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ msg: 'Invalid credentials' });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   console.log(isMatch);
//   if (!isMatch) {
//     return res.status(400).json({ msg: 'Invalid credentials' });
//   }

//   const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
//   console.log(payload);
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: '1h',
//   });
//   res.json({ token });
// });

exports.getIndividualUsers = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// exports.createNewUser = async (req, res) => {
//   try {
//     const newUser = await User.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.editUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  }).select('-password');
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  } //res.status(404).json({ msg: 'User not found' });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
