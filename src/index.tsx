import React from 'react';
import { render } from 'react-dom';
import App from './renderer/App';
// @ts-ignore
import { Provider } from 'react-redux'

import * as stateStorage from "./renderer/storage/state-storage";

const store = stateStorage.getStore();

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
