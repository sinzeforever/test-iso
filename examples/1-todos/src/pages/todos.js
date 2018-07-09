import headComponent from '../components/Header'
import mainComponent from '../components/TodoApp'
import reducer from '../reducers/todos-reducer'
import { createStore, clientRender } from 'redus'

const initStore = createStore(reducer);

// You can take request, route and store here
// In most case, you only need to get store here.
const handler = ({ route, store, request }) => {
    // you can return customized store
    // or return customized route.
    // In most case you only need to do store.dispatch() here
    return { route, store };
}

// Define a page for server side
const page = { headComponent, mainComponent, handler, initStore };
export default page

// for client side rendering
clientRender({ mainComponent, initStore })
