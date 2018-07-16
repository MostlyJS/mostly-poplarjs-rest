const makeDebug = require('debug');
const validator = require('validator');

const debug = makeDebug('mostly:poplarjs:rest:wrappers');

const statusCodes = {
  created: 201,
  noContent: 204,
  methodNotAllowed: 405
};

const allowedMethods = {
  get:    'GET',
  post:   'POST',
  put:    'PUT',
  patch:  'PATCH',
  delete: 'DELETE'
};

// A function that returns the middleware for a given method
function getHandler (method, trans, version) {
  return function (req, res, next) {
    res.setHeader('Allow', Object.values(allowedMethods).join(','));

    let service = req.params.__service;
    let id = req.params.__id;
    let action = req.params.__action;
    let path = '/' + service +
      (id? '/' + id : '') +
      (action? '/' + action : '');
    
    // guess whether id is an action?
    if (id && !action) {
      if (!(validator.isNumeric(id) || validator.isMongoId(id))) {
        action = id;
      }
    }
    service += (action? '.' + action : '');
    
    debug(`REST handler calling service \'${service}\'`);
    debug(` => cmd  \'${method}\'`);
    debug(` => path \'${path}\'`);
    debug(` => version \'${version}\'`);

    // The service success callback which sets res.data or calls next() with the error
    const callback = function (err, data) {
      debug(' => service response:', err, data);
      if (err) return next(err.cause || err);

      res.data = data;

      if (!data) {
        debug(`No content returned for '${req.url}'`);
        res.status(statusCodes.noContent);
      } else if (method === 'post') {
        res.status(statusCodes.created);
      }

      return next();
    };

    trans.act({
      topic: `poplar.${service}`,
      cmd: method,
      path: path,
      version: version,
      headers: req.headers || {},
      query: req.query || {},
      body: req.body || {}
    }, callback);
  };
}


// Returns wrapped middleware for a service method.
module.exports = {
  get: getHandler.bind(null, 'get'),
  post: getHandler.bind(null, 'post'),
  put: getHandler.bind(null, 'put'),
  patch: getHandler.bind(null, 'patch'),
  delete: getHandler.bind(null, 'delete')
};
