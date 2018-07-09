import express from 'express'
import routing from './routing.js'
import { createMiddlewareByRoute } from 'redus'

let app = express()

// set statics path
app.use('/statics', express.static(process.cwd() + '/statics'));

// set up redus middleware
app.use(createMiddlewareByRoute(routing));

app.listen(3001, function () {
    console.log('Server start! Listening on port 3001');
});
