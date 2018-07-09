import { clientRender, createMiddlewareByRoute } from '../src/index';

const isomorphicRedux = require('../src/index');

describe('index.js', () => {
  it('export all functions correctly', () => {
    expect(typeof clientRender).toEqual('function');
    expect(typeof createMiddlewareByRoute).toEqual('function');
  });

  it('do es5 module.exports correctly', () => {
    expect(typeof isomorphicRedux.clientRender).toEqual('function');
    expect(typeof isomorphicRedux.createMiddlewareByRoute).toEqual('function');
  });
});
