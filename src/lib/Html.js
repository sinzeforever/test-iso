import React, { Component as ReactComponent } from 'react';

class Html extends ReactComponent {
  render() {
    const { route, store } = this.props;
    const Page = this.props.mainComponent;
    const Header = this.props.headComponent; // custom headComponent
    let Scripts = this.props.scripts; // custom scripts component. If no custom scripts, we use default path
    const redusData = global.window ? global.window.__REDUS__ : {
      preloadedState: store.getState(),
      route,
      staticPath: process.env.REDUS_BUNDLE_PATH || '/statics/bundle',
    };
    const redusDataString = JSON.stringify(redusData);

    if (typeof Scripts === 'function') {
      Scripts = <Scripts />;
    }

    return (
      <html>
        {typeof Header === 'function' ? <Header route={route} store={store} /> : Header}
        <body>
          <div id="redus-root">
            {Page ? <Page route={route} /> : undefined}
          </div>
          <div id="redus-scripts">
            <div id="redus-data" data-redus={redusDataString} />
            {Scripts || <script async src={`${redusData.staticPath}/${route.name}.js`} />}
          </div>
        </body>
      </html>
    );
  }
}
export default Html;
