require = require("esm")(module/*, options*/);
console.time('mostly-poplarjs-rest import');
module.exports = require('./src/index').default;
console.timeEnd('mostly-poplarjs-rest import');
