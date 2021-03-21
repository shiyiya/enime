import React from 'react';
import { render } from 'react-dom';
import App from './renderer/App';
// @ts-ignore
import { Provider } from 'react-redux'

import * as stateStorage from "./shared/storage/state-storage";
import Modal from "react-modal";

const store = stateStorage.configureStore(null, 'renderer');
Modal.setAppElement(document.getElementById('root'))

render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'));
