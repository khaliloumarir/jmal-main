import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter, Routes,
  Route,
} from "react-router-dom";
import AddProduct from "./routes/AddProduct"
import DemandProduct from "./routes/DemandProduct"
import TelegramLogin from "./routes/TelegramLogin"
import Feed from "./routes/Feed"
import ProductPage from "./routes/ProductPage"
import Authentication from "./routes/Authentication"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import combinedReducers from "./reducers"
import thunk from "redux-thunk"
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase"
import firebase from "./firebase"
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import { createFirestoreInstance, getFirestore } from 'redux-firestore'
import { QueryClientProvider, QueryClient } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, combinedReducers)
const store = createStore(persistedReducer, applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })))
let persistor = persistStore(store)
const rrfConfig = {
  userProfile: 'users'
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}
const queryClient = new QueryClient()
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="addproduct" element={<AddProduct />} />
              <Route path="demandproduct" element={<DemandProduct />} />
              <Route path="telegram" element={<TelegramLogin />} />
              <Route path="authentication" element={<Authentication />} />
              {/* TODO: Change the path=/ to contain a component that checks auth and sends to the right paths telegramLogin or feed or login then telegramLogin then feed or feed right away */}
              <Route path=":channel" element={<Feed />} />
              <Route path="product" element={<ProductPage />} />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </ReactReduxFirebaseProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
