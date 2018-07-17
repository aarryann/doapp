import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose, Middleware } 	from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
//import createHistory from 'history/createHashHistory'

import reducers from './pipes/reducers'
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { waitForDeviceReady }	from './services/utils';
import { loadDB }	from './services/utils/mobile.db.utils';

import './assets/css/index.css';
import IStoreState from './app/IStoreState';

const history = createHistory()
const initialState: IStoreState = {};
const enhancers = [];
const middlewares: Middleware[] = [
	thunkMiddleware,
];

if (process.env.NODE_ENV !== 'development'){
	const loggerMiddleware: Middleware = createLogger({
		level: 'info',
		collapsed: true,
	})

	middlewares.push(loggerMiddleware);
	const devToolsExtension = window['devToolsExtension'];

	if (typeof devToolsExtension === 'function'){
		enhancers.push(devToolsExtension());
	}
}

const composedMiddlewares = compose(
	applyMiddleware(routerMiddleware(history), ...middlewares),
	...enhancers
);

const store = createStore<IStoreState, any, any, any>(
  reducers,
	initialState,
	composedMiddlewares
)

const startApp = () => {
	ReactDOM.render(
	  <Provider store={store}>
	    { /* ConnectedRouter will use the store from Provider automatically */ }
	    <ConnectedRouter history={history}>
	  		<App />
	    </ConnectedRouter>
	  </Provider>,
	  document.getElementById('main_container')
	);
}

const startMobileApp = async (dbName: string) => {
  await waitForDeviceReady();
  loadDB(dbName);
  startApp();
}

if (window['cordova']){
  startMobileApp('doapp.db');
} else {
  startApp();
	registerServiceWorker();
}
