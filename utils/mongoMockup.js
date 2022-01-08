const Messages = require('../models/Message');
const mongoose = require('mongoose');
const sinon = require('sinon');
require('sinon-mongoose');

exports.findMessages = (output, params) => {
  sinon
    .mock(Messages)
    .expects('find')
    .withArgs({ room: params.roomId })
    .chain('sort')
    .withArgs({ datetime: -1 })
    .chain('limit')
    .withArgs(200)
    .chain('exec')
    .resolves(output);
};

exports.save = (output) => {
  sinon
    .mock(new Messages(output))
    .expects('save')
    .resolves(output);
};

exports.connect = () => {
  sinon
    .mock(mongoose)
    .expects('connect')
    .resolves();
};
exports.restore = () => {
  try {
    sinon.restore();
  } catch {
    // do nothing
  }
};
