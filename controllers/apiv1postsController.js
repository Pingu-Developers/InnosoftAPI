'use strict';

const varapiv1postsController = require('./apiv1postsControllerService');

module.exports.getPosts = function getPosts (req, res, next) {
  varapiv1postsController.getPosts(req.swagger.params, res, next);
};
