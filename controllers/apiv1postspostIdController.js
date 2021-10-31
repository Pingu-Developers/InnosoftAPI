'use strict';

const varapiv1postspostIdController = require('./apiv1postspostIdControllerService');

module.exports.findPostByPostId = function findPostByPostId (req, res, next) {
  varapiv1postspostIdController.findPostByPostId(req.swagger.params, res, next);
};
