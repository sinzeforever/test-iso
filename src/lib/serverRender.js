import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import _ from 'underscore.string';
import Html from './Html';

export const serverRender = ({ mainComponent, headComponent, route, store, scripts }) => {
  if (!mainComponent) {
    throw new Error('no mainComponent!');
  }
  if (!headComponent) {
    throw new Error('no headComponent!');
  }
  if (!store) {
    throw new Error('no store!');
  }

  const Main = mainComponent;
  const componentString = renderToString(
    <Provider store={store}>
      <Main route={route} />
    </Provider>,
  );
  const htmlString = `<!DOCTYPE html>${renderToStaticMarkup(
    <Html headComponent={headComponent} store={store} route={route} scripts={scripts} />,
  )}`;

  const insertPosition = htmlString.indexOf('redus-root') + 12;

  // put componetString inside static html string, inside "redus-root"
  return _.insert(htmlString, insertPosition, componentString);
};

export default serverRender;
