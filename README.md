The library help you render the redux-react components.  
It doesn't restrict your project structure and how you implement react-redux.   
We can focus on deveolping redux elements - components, actions, reducers,
and don't need to copy the same server setting on each projects.

It provide you the **express middleware**, **client-render** , and **server-render** function.   
So prepare your redux reducers, store, components and containers by yourself,  
along with **routing.js**, **page-init-script** and **your custom header**.
Redus will help you render all together.  
Also, you can change your page header by redux since the whole page is under redux.

# Getting start

This library helps us create an isomorphic redux-react application.  
See [Examples](examples) for more details.

First, npm install the library.
```
npm install --save redus
```
To use the library, we should prepare the following stuffs properly:

### routing.js
The routing.js is a js file which contains a routing object.
Here we use routr library to parse the routing, and the format is like:

```
# routing.js

import { page as TodosPage } from './pages/todos-server.js'
import { page as ProductList } from  './pages/productList-server.js'
module.exports = {
    todos: {
        path: '/todos',
        method: 'get',
        page: TodosPage
    },
    productList: {
        path: '/products',
        method: 'get',
        page: ProductList
    }
};
```

### express server entry
In your express server script, use _setupMiddleware_ function  
The library will provide a middleware to set up the system 
```
import { setupMiddleware } from 'redus'
let app = express()

// set up redus middleware
app.use(createMiddlewareByRoute(routing))

app.listen(3000, function () {
    console.log('Server start! Listening on port 3000');
});
```

### wepback.config.js
To enable client side script, we should bundle the client-side script onto proper directory  
Redus library will try to search the client side page script in __/statics/bundle/[page].js__  

Here's the entry && output part in webpack
```
    entry: {
        productList: 'src/pages/productList-client.js',
        productPage: 'src/pages/productPage-client.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/statics/bundle'
    },
```
In the example I suppose the client-side script is put under pages/ folder.  
The middleware will automatically set the folder /statics to be express static folder  
You can set it be setting environment variable , ex  ```export REDUS_BUNDLE_PATH=/statics/client```  

### page definition
To define a page, we need to know these:
* headComponent: a react component for `<head> ... </head>`
* mainCompoent: a react component, it is the major `<div> ... </div>` inside the `<body>`
* initStore: a store creator function which can create a redux store with initial state

In most case we can put all of these into a client script, then the server side page script can reuse these definition.

### server side script
The server side script contains the page definition and a handler.

Here's a full example of a server side page script:
```
# productList-server.js

import { createStore } from 'redux'
import reducer from '../reducers/products'
import header from '../containers/Header.js'
import { fetchProducts } from '../actions/products.js'
import page from '../containers/ProductList.js'

// this function should be put in routing.js
// the route info will be pass in by library
export const handler = ({ route, store }) => {

    const store = createStore(reducer)

    // suppose we fetch products in this page
    // the response should be return in Promise structure
    return store.dispatch(fetchProducts())
        .then(() => ({
            mainComponent: page,
            headComponent: header,
            route,
            store: store
        }))
}
```

You can trturn extra __scripts__ ,
it will then replace the default script tag.
ex:
```
const scripts = <script src='/statics/myscript.js' />
return { mainComponent, headComponent, route, store, scripts };
```

We separate the server and client script so we can hide somethings from client.  
For example, the initial API calls can happen only in server side.  
Some reducers or actions can be server-side only  

### client side script
Client side script is very simple.
We just need page component, reducer and header

```
# productList-client.js
import { clientRender } from 'redus'
import reducer from '../reducers/products'
import page from '../containers/ProductList.js'

clientRender({
    mainComponent: component,
    reducer: reducer
});
```
The store will be created by _clientRender_ function
You can pass additional middlewares or store configuration call-back function to configure the store.

# Error handling

TBD...

# Examples

Here I've written several examples under /examples.
You can learn basic redux concept if you're not familiar with redux as well.

1. [Todos](examples/1-todos) - a very simple todo app to show how to use the library.

# To be developed
The library is now in a test version. There are some other features that could be implemented:
* Support single app
* Support extra setting on html
* Support client-side | server-side only | static mockup rendering
