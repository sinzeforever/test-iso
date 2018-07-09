import Router from 'routr';
import { serverRender } from './serverRender';

class redusMiddlewareExpection extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
  }
}

export class RouteNotMatchedError extends redusMiddlewareExpection {
  constructor(url) {
    super(`Route not matched: ${url}`, 404);
  }
}

export class RouteConfigError extends redusMiddlewareExpection {}

// You can do this to redirect at server side:
//   import { HandleRedirect } from 'redus';
//   throw new HandleRedirect('/foo/bar');
export class HandleRedirect extends redusMiddlewareExpection {
  constructor(url) {
    super(url, 301);
  }
}

export const createMiddlewareByRoute = (routing, shouldHandleAllURL = false) => {
  const router = new Router(routing);
  return (req, res, next) => {
    /**
     * Route params from routr
     *  name (key in routing.js)
     *  method (GET, POST)
     *  params (ex /:id)
     *  query (ex ?abc=123)
     *  config (configs in routing.js)
     */
    const route = router.getRoute(req.url, { method: req.method });
    let job = 0;

    if (!route) {
      return next(shouldHandleAllURL ? new RouteNotMatchedError(`url: "${req.url}", method: "${req.method}"`) : undefined);
    }

    if (!route.config.page) {
      return next(new RouteConfigError(`The .page is undefined under route config "${route.name}"!`));
    }

    const { handler, ...page } = route.config.page;

    if (!handler) {
      return next(new RouteConfigError(`The .page.handler is undefined under route config "${route.name}"!`));
    }

    if (!handler.apply) {
      return next(new RouteConfigError(`The .page.handler is not a function under route config "${route.name}"!`));
    }

    let store;
    try {
      if (page.initStore) {
        store = page.initStore();
        // To support reservice, we keep request object under store
        store.req = req;
        store.dispatch({
          type: 'SET_PAGE_INFO',
          payload: {
            request: req,
            ...route,
          },
        });
      }
      job = Promise.resolve(handler({ route, store, request: req }));
    } catch (E) {
      job = Promise.reject(E);
    }

    return job
    .then((result) => {
      const context = { store, ...page, ...result };
      if (!context.mainComponent) {
        return next(new RouteConfigError(`The .page.mainComponent is not defined under route config "${route.name}", or pageHandler not return mainComponent!`));
      }

      if (!context.headComponent) {
        return next(new RouteConfigError(`The .page.headComponent is not defined under route config "${route.name}", or pageHandler not return headComponent!`));
      }

      if (!context.store) {
        return next(new RouteConfigError(`The .page.initStore is not defined under route config "${route.name}", or pageHandler not return store!`));
      }

      return res.send(serverRender(context));
    })
    .catch(error => ((error instanceof HandleRedirect)
            ? res.redirect(error.message)
            : next(error)),
    );
  };
};

export default createMiddlewareByRoute;
