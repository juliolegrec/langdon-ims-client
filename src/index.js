import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { StoreContext } from 'redux-react-hook';
// import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
	<StoreContext.Provider value={store}>
		<App />
	</StoreContext.Provider>,
	document.getElementById('root')
);
