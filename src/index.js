import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux";
import store from './core/redux/store';
import {SnackbarProvider} from "notistack"
import * as serviceWorker from './core/system/serviceWorkerRegistration'

ReactDOM.render(
    <Provider store={store}>
      <SnackbarProvider anchorOrigin={{vertical:"bottom",horizontal:"right"}}>
        <App />
      </SnackbarProvider>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
