'use strict';

const varapiv1eventseventIdController = require('./apiv1eventseventIdControllerService');

module.exports.findEventByEventId = function findEventByEventId (req, res, next) {
  varapiv1eventseventIdController.findEventByEventId(req.swagger.params, res, next);
};
