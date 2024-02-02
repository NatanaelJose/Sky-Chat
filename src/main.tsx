import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faCog, faComment, faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faCog, faComment, faUser);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
