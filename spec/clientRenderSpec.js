import * as redux from 'redux';
import clientRender from '../src/lib/clientRender';
import { encodeData } from '../src/lib/util';

const reactDom = require('react-dom');

describe('clientRender', () => {
  const oldWindow = global.window;

  const MockPage = () => null;

  beforeEach(() => {
    spyOn(redux, 'createStore').and.callThrough();
    spyOn(reactDom, 'render');
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('do nothing when no global window', () => {
    global.window = null;
    clientRender({});
    expect(redux.createStore).not.toHaveBeenCalled();
    expect(reactDom.render).not.toHaveBeenCalled();
  });

  it('do not render full mode when no header', () => {
    global.window = {
      __REDUS__: encodeData({
        renderMode: 'full',
        route: {},
        page: {},
        preloadedState: {},
      }),
      document: {
        getElementById: id => id,
      },
    };
    clientRender({
      reducer: () => ({}),
      mainComponent: MockPage,
    });

    expect(redux.createStore).toHaveBeenCalled();
    expect(reactDom.render.calls.count()).toBe(1);
    expect(reactDom.render).toHaveBeenCalledWith(jasmine.any(Object), 'redus-root');
  });
});
