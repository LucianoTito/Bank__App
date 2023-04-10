const express = require('express');

/*Controllers */

const userController = require('../controllers/user.controller');

/*Middlewares */

const userMiddleware = require('../middlewares/user.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();
router
  .route('/')
  .post(
    userMiddleware.validIfExistUser,
    validationMiddleware.createUserValidation,
    userController.createAccount
  )
  .post(
    userMiddleware.validIfExistUser,
    validationMiddleware.loginUserValidation,
    userController.login
  );

router
  .route('/:id/history')
  .get(userMiddleware.validIfExistUser, userController.getTransferHistory);
