import { createStore as reduxStore, applyMiddleware } from 'redux';

export const encodeData = (data) => {
  const str = JSON.stringify(data);
  const buf = [];
  for (let i = str.length - 1; i >= 0; i -= 1) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};

export const decodeData = (str) => {
  const dataString = str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  return JSON.parse(dataString);
};

// A generic function creator to create a store with/without initial state
export const createStore = (reducer, middlewares = []) => initState => (initState ? reduxStore(
  reducer,
  initState,
  applyMiddleware(...middlewares),
) : reduxStore(
  reducer,
  applyMiddleware(...middlewares),
));
