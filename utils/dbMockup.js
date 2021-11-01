const sinon = require('sinon');
const mock = sinon.mock(require('./dbConnection'));

exports.query = (query, output, params) => {
  if (params) {
    mock.expects('query').withExactArgs(query, params).resolves(output);
  } else {
    mock.expects('query').withExactArgs(query).resolves(output);
  }
};
exports.restore = () => {
  mock.restore();
};
exports.verify = () => {
  mock.verify();
};
