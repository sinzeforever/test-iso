import React from 'react'
import Filter from './Filter'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <h1>Todos</h1>
    <AddTodo />
    <VisibleTodoList />
    <Filter />
  </div>
)

export default App
