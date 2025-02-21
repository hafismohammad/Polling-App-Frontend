  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { AuthProvider } from './context/AuthContext.jsx'
  import {  } from "redux-persist/integration/react";
  import { Provider } from "react-redux";
  import store, { persistor } from "./redux/store";
  import { PersistGate } from "redux-persist/integration/react";

  createRoot(document.getElementById('root')).render(
    <StrictMode>

<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
      <App />
      </AuthProvider>
      </PersistGate>
      </Provider>
    </StrictMode>,
  )
