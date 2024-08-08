const express = require('express');
const authController = require(`../controllers/authController`);
const userController = require(`../controllers/userController`);
const router = express.Router();

// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route(`/`)
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createNewUser
  );

router
  .route(`/:id`)
  .get(authController.protect, userController.getIndividualUsers) //
  .patch(authController.protect, userController.editUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
//[auth, admin]
