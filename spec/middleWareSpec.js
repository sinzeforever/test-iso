import { createMiddlewareByRoute, RouteNotMatchedError, RouteConfigError, HandleRedirect } from '../src/index';
import * as render from '../src/lib/serverRender';
// To polyfill Reflect in node4 , can be removed if we drop node4 support
require('harmony-reflect');

describe('middleWare', () => {
  beforeEach(() => spyOn(render, 'serverRender'));

  it('should pass to next middleware when route not matched by default', (done) => {
    const middleware = createMiddlewareByRoute([{ name: 'foo', path: 'bar' }]);
    middleware({ url: 'qqq', method: 'GET' }, undefined, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });

  it('should handle route not found when enforced', (done) => {
    const middleware = createMiddlewareByRoute([{ name: 'foo', path: 'bar' }], true);
    middleware({ url: 'qqq', method: 'GET' }, undefined, (err) => {
      expect(err).toEqual(new RouteNotMatchedError('url: "qqq", method: "GET"'));
      done();
    });
  });

  it('should detect config .page is undefined error', (done) => {
    const middleware = createMiddlewareByRoute([{ name: 'foo', path: 'bar' }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page is undefined under route config "foo"!'));
      done();
    });
  });

  it('should detect config .page.handler is not function error', (done) => {
    const middleware = createMiddlewareByRoute([{ name: 'foo', path: 'bar', page: { handler: 'moo' } }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page.handler is not a function under route config "foo"!'));
      done();
    });
  });

  it('should detect config .page.handler is undefined error', (done) => {
    const middleware = createMiddlewareByRoute([{ name: 'foo', path: 'bar', page: {} }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page.handler is undefined under route config "foo"!'));
      done();
    });
  });

  it('should detect mainComponent is undefined error', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => {},
      },
    }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page.mainComponent is not defined under route config "foo", or pageHandler not return mainComponent!'));
      done();
    });
  });

  it('should detect headComponent is undefined error', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => ({ mainComponent: true }),
      },
    }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page.headComponent is not defined under route config "foo", or pageHandler not return headComponent!'));
      done();
    });
  });

  it('should detect store is undefined error', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => ({ mainComponent: true }),
        headComponent: true,
      },
    }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err).toEqual(new RouteConfigError('The .page.initStore is not defined under route config "foo", or pageHandler not return store!'));
      done();
    });
  });

  it('should execute .page.handler for route', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => ({ executed: 'yes', headComponent: true, store: true }),
        mainComponent: true,
      },
    }]);
    middleware({ url: 'bar' }, { send: () => {
      expect(render.serverRender).toHaveBeenCalledWith({
        store: true,
        executed: 'yes',
        headComponent: true,
        mainComponent: true,
      });
      done();
    } }, (error) => {
      fail(error);
    });
  });

  it('should detect error in .page.handler()', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => {
          throw new Error('no!');
        },
        headComponent: true,
        mainComponent: true,
      },
    }]);
    middleware({ url: 'bar' }, undefined, (err) => {
      expect(err.message).toBe('no!');
      done();
    });
  });

  it('should handle redirect', (done) => {
    const middleware = createMiddlewareByRoute([{
      name: 'foo',
      path: 'bar',
      page: {
        handler: () => {
          throw new HandleRedirect('/oh/ya');
        },
        headComponent: true,
        mainComponent: true,
      },
    }]);
    middleware({ url: 'bar' }, { redirect: (url) => {
      expect(url).toBe('/oh/ya');
      done();
    } });
  });
});
