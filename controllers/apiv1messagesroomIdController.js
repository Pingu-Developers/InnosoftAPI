'use strict';

const varapiv1messagesroomIdController = require('./apiv1messagesroomIdControllerService');

module.exports.findMessagesByRoomId = function findMessagesByRoomId (req, res, next) {
  varapiv1messagesroomIdController.findMessagesByRoomId(req.swagger.params, res, next);
};

module.exports.addMessageByRoomId = function addMessageByRoomId (req, res, next) {
  varapiv1messagesroomIdController.addMessageByRoomId(req.swagger.params, res, next);
};
