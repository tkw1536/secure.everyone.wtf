import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import App from './App'

const cache = createCache({ key: 'css' })
const root = document.getElementById('root')
if (root === null) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <App defaultNumChar={64} numPresets={[50, 64, 128]} />
    </CacheProvider>
  </React.StrictMode>
)

