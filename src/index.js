import makeDebug from 'debug';
import wrappers from './wrappers';

const debug = makeDebug('mostly:poplarjs:rest');

function formatter(req, res, next) {
  if (res.data === undefined) {
    return next();
  }
  res.format({
    'application/json': function () {
      res.json(res.data);
    }
  });
}

export default function rest(app, trans, path, options = {}) {
  const handler = options.handler || formatter;
  const version = options.version || '*';

  // Register the REST provider
  const uri = path || '';
  const baseRoute = app.route(`${uri}/:__service`);
  const idRoute = app.route(`${uri}/:__service/:__id`);
  const actionRoute = app.route(`${uri}/:__service/:__id/:__action(*)`);

  debug(`Adding REST handler for service route \`${uri}\``);

  baseRoute.get(wrappers.get(trans, version), handler);
  baseRoute.post(wrappers.post(trans, version), handler);
  baseRoute.patch(wrappers.patch(trans, version), handler);
  baseRoute.put(wrappers.put(trans, version), handler);
  baseRoute.delete(wrappers.delete(trans, version), handler);

  idRoute.get(wrappers.get(trans, version), handler);
  idRoute.patch(wrappers.patch(trans, version), handler);
  idRoute.put(wrappers.put(trans, version), handler);
  idRoute.delete(wrappers.delete(trans, version), handler);

  actionRoute.get(wrappers.get(trans, version), handler);
  actionRoute.patch(wrappers.patch(trans, version), handler);
  actionRoute.put(wrappers.put(trans, version), handler);
  actionRoute.delete(wrappers.delete(trans, version), handler);

  return function (req, res, next) {
    next();
  };
}

