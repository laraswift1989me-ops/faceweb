import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import { APP_NAME } from './config'

document.title = APP_NAME;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)