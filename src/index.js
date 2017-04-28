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

export default function rest(app, mostly, path, handler = formatter) {
  // Register the REST provider
  const uri = path || '';
  const baseRoute = app.route(`${uri}/*`);

  debug(`Adding REST handler for service route \`${uri}\``);

  baseRoute.get(wrappers.get(mostly), handler);
  baseRoute.post(wrappers.post(mostly), handler);
  baseRoute.patch(wrappers.patch(mostly), handler);
  baseRoute.put(wrappers.put(mostly), handler);
  baseRoute.delete(wrappers.delete(mostly), handler);

  return function (req, res, next) {
    next();
  };
}

