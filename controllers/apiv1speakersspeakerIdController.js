'use strict'

var varapiv1speakersspeakerIdController = require('./apiv1speakersspeakerIdControllerService');

module.exports.findSpeakerBySpeakerId = function findSpeakerBySpeakerId(req, res, next) {
  varapiv1speakersspeakerIdController.findSpeakerBySpeakerId(req.swagger.params, res, next);
};