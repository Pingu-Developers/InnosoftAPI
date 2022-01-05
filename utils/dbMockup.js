const mongoose = require('mongoose');
const sinon = require('sinon');
require('sinon-mongoose');

const dbCon = require('./dbConnection');
const Messages = require('../models/Message');
let mock = sinon.mock(dbCon);

exports.query = (query, output, params) => {
  if (params) {
    mock.expects('query').withExactArgs(query, params).resolves(output);
  } else {
    mock.expects('query').withExactArgs(query).resolves(output);
  }
};

exports.findMessages = (output, params) => {
  if (Array.isArray(output)) {
    output.forEach(m => {
      m._id = mongoose.Types.ObjectId(m._id);
      m.datetime = new Date(m.datetime);
      m.user._id = mongoose.Types.ObjectId(m.user._id);
    });
  }

  sinon
    .mock(Messages)
    .expects('find')
    .withArgs({ room: params.roomId })
    .chain('sort')
    .withArgs({ datetime: -1 })
    .chain('exec')
    .resolves(output);
};

exports.restore = () => {
  try {
    sinon.restore();
    mock = sinon.mock(dbCon);
    mongomock = undefined;
  } catch {
    // do nothing
  }
};
