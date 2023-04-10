const express = require('express');

/*CONTROLLERS */
const transferController = require('../controllers/transfer.controller');

const router = express.Router();

router.route('/').post(transferController.transfer);
