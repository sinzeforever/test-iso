// Every project starts from this routing config,
// You can define all supported path here.
// To know more about the path format, please check
// the routr document: https://github.com/yahoo/routr#usage

import TodoPage from './pages/todos.js'

module.exports = {
    todos: {
        path: '/todos',
        method: 'get',
        page: TodoPage
    }
};
