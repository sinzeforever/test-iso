import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

export default ({ mainComponent, middlewares, initStore, configureStore, reducer }) => {
  /* client side script*/
  if (!global.window) {
    return;
  }

  const redusData = global.window.__REDUS__ || JSON.parse(
    global.window.document.getElementById('redus-data').getAttribute('data-redus'),
  );
  const initialState = redusData.preloadedState;
  const route = redusData.route;
  const Page = mainComponent;
  let clientStore;

  if (initStore) { // if custom initStore function is given
    clientStore = initStore(initialState);
  } else if (configureStore) { // if custom configureStore function is given
    clientStore = configureStore(reducer, initialState);
  } else if (middlewares) { // if custom middlewares are given
    clientStore = createStore(
      reducer,
      initialState,
      applyMiddleware(...middlewares),
    );
  } else {
    clientStore = createStore(
      reducer,
      initialState,
    );
  }

  // assign redus data to window
  global.window.__REDUS__ = redusData;

  render(
    <Provider store={clientStore}>
      <Page route={route} />
    </Provider>
  , global.window.document.getElementById('redus-root'));
};
