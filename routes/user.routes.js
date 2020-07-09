'use strict'

var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var middlewareEnsureAuth = require('../middlewares/authenticated');

api.post('/commands', middlewareEnsureAuth.ensureAuth, userController.commands);

module.exports = api;
