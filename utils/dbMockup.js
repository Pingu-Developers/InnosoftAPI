const sinon = require('sinon');
const dbCon = require('./dbConnection');
let mock = sinon.mock(dbCon);

exports.query = (query, output, params) => {
  if (params) {
    mock.expects('query').withExactArgs(query, params).resolves(output);
  } else {
    mock.expects('query').withExactArgs(query).resolves(output);
  }
};
exports.restore = () => {
  try {
    sinon.restore();
    mock = sinon.mock(dbCon);
  } catch {
    // do nothing
  }
};
