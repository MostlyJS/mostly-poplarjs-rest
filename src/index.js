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

export default function rest(app, trans, path, handler = formatter) {
  // Register the REST provider
  const uri = path || '';
  const baseRoute = app.route(`${uri}/:__service`);
  const idRoute = app.route(`${uri}/:__service/:__id`);
  const actionRoute = app.route(`${uri}/:__service/:__id/:__action(*)`);

  debug(`Adding REST handler for service route \`${uri}\``);

  baseRoute.get(wrappers.get(trans), handler);
  baseRoute.post(wrappers.post(trans), handler);
  baseRoute.patch(wrappers.patch(trans), handler);
  baseRoute.put(wrappers.put(trans), handler);
  baseRoute.delete(wrappers.delete(trans), handler);

  idRoute.get(wrappers.get(trans), handler);
  idRoute.patch(wrappers.patch(trans), handler);
  idRoute.put(wrappers.put(trans), handler);
  idRoute.delete(wrappers.delete(trans), handler);

  actionRoute.get(wrappers.get(trans), handler);
  actionRoute.patch(wrappers.patch(trans), handler);
  actionRoute.put(wrappers.put(trans), handler);
  actionRoute.delete(wrappers.delete(trans), handler);

  return function (req, res, next) {
    next();
  };
}

