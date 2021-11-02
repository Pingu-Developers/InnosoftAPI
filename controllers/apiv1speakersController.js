'use strict';

const varapiv1speakersController = require('./apiv1speakersControllerService');

module.exports.getSpeakers = function getSpeakers (req, res, next) {
  varapiv1speakersController.getSpeakers(req.swagger.params, res, next);
};
