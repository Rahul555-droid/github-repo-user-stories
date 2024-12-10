// @ts-nocheck
import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </QueryClientProvider>
)
