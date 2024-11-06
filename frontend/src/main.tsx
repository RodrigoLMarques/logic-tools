import React from 'react'
import ReactDOM from 'react-dom/client'
import TruthTableGenerator from './TruthTableGenerator'
import './index.css'

const renderApp = () => {
  const rootElement = document.getElementById('root')

  if (!rootElement) {
    throw new Error('Failed to find the root element')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TruthTableGenerator />
    </React.StrictMode>
  )
}

renderApp()

if (import.meta.hot) {
  import.meta.hot.accept()
}