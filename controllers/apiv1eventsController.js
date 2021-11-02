'use strict';

const varapiv1eventsController = require('./apiv1eventsControllerService');

module.exports.getEvents = function getEvents (req, res, next) {
  varapiv1eventsController.getEvents(req.swagger.params, res, next);
};
