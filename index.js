var libpath = process.env.VALUECHECKER_COV ? 'lib-cov' : 'lib';

module.exports = require('./' + libpath);
