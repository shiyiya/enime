import React from 'react';
import { render } from 'react-dom';
import App from './renderer/App';
// @ts-ignore
import { Provider } from 'react-redux'

import * as stateStorage from "./shared/storage/state-storage";

const store = stateStorage.configureStore(null, 'renderer');

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
