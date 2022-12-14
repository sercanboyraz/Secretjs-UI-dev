import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';

const stores = initializeStores();

ReactDOM.render(
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ,document.getElementById('root') as HTMLElement
);

registerServiceWorker();

