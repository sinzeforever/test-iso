import { createStore } from 'redux';
import React from 'react';
import { serverRender } from '../src/lib/serverRender';

const page1 = () => <h1>Page</h1>;
const header = () => <head><title>Title</title></head>;
const route = {
  name: 'page1',
  method: 'GET',
  param: {},
  query: {},
  config: {
    page: page1,
  },
};
const initialState = { apple: 'red' };
const reducer = state => state;

describe('serverRender', () => {
  const store = createStore(reducer, initialState);

  beforeEach(() => spyOn(console, 'warn'));

  it('should error when no mainComponent', () => {
    expect(() => serverRender({ route, store })).toThrow(new Error('no mainComponent!'));
  });

  it('should error when no headComponent', () => {
    expect(() => serverRender({ mainComponent: page1, route, store })).toThrow(new Error('no headComponent!'));
  });

  it('should error when no store', () => {
    expect(() => serverRender({ mainComponent: page1, headComponent: header, route })).toThrow(new Error('no store!'));
  });

  it('render html in component mode correctly', () => {
    const serverRenderResult = serverRender({ mainComponent: page1, headComponent: header, route, store });

    const expectDomString = '<!DOCTYPE html><html><head><title>Title</title></head><body><div id="redus-root"><h1 data-reactroot="" data-reactid="1" data-react-checksum="-2007298173">Page</h1></div><div id="redus-scripts"><div id="redus-data" data-redus="{&quot;preloadedState&quot;:{&quot;apple&quot;:&quot;red&quot;},&quot;route&quot;:{&quot;name&quot;:&quot;page1&quot;,&quot;method&quot;:&quot;GET&quot;,&quot;param&quot;:{},&quot;query&quot;:{},&quot;config&quot;:{}},&quot;staticPath&quot;:&quot;/statics/bundle&quot;}"></div><script async="" src="/statics/bundle/page1.js"></script></div></body></html>';
    expect(serverRenderResult).toBe(expectDomString);
  });
});
