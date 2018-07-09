# Example1 - Todos

### Getting started

```
cd examples/1-todos
npm install
npm install ../..
```

You will need 2 console to execute this example, the first one is to handle webpack file monitoring and bundling, the second one is to start the express server:

```
[screen1] npm run webpack
[screen2] npm run nodemon  
```

After the server started, you may browse http://{host}:3001/todos to see the result.

### How it works

In this example, we use redus library to help render to Todos app.  
All the todos components, reducers and actions are from [Redux official webpage](http://redux.js.org/docs/basics/ExampleTodoList.html)  

What we do is use the library to isomorphically render the page


#### src/routing.js

We specifiy the server side page script
```
import TodoPage from './pages/todos.js'

module.exports = {
    todos: {
        path: '/todos',
        method: 'get',
        page: TodoPage
    }
};
```
The routing handler here we use _routr_ library to handle it


#### webpack-config.js

We bundle the script to todos.js under */statics/bundle*, which is the default path redus looks for.

```
    entry: {
        todos: pageSrcPath + 'todos.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/statics/bundle'
    },
```

#### src/server.js
In our express server script, we create a express server and use the redus middleware to handle isomorphic rendering.
```
import express from 'express'
import routing from './routing.js'
import { createMiddlewareByRoute } from 'redus'

let app = express()

// set static path
app.use('/statics', express.static(process.cwd() + '/statics'));

// set up redus middleware
app.use(createMiddlewareByRoute(routing))

app.listen(3001, function () {
    console.log('Server start! Listening on port 3001');
});
```

#### src/pages/todos.js

In this example, we combine server side and client side script together.  
We may separate it into xxx-server.js and xxx-client.js if needed.  
We use rendering methods from redus to render the app. 
First we import the elements of Todos and redus library
```
import header from '../components/Header'
import page from '../components/TodoApp'
import reducer from '../reducers/todos-reducer'
import { createStore } from 'redux'
import { serverRender, clientRender } from 'redus'
```

We write a function to run our server init script and export it.
The redus library will pass __route__ params automatically.

Finally we return the result from __serverRender__. 
Make sure to pass those page component, header component into it.

```
const pageScript = (route) => {
    // you should combine the reducers by yourself if needed
    // pass the reducer to createStore from redux and create the store
    const store = createStore(reducer)
    // the serverRender function require the following four params
    return serverRender({ page, header, route, store })
}
export default pageScript
```

As for clientSide, we do __clientRender__ outside to render in client side.  
Here we pass page, header and reducer.
```
clientRender({ page, reducer })
```
The library will help handling all the client side stuff
