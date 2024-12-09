// @ts-nocheck
import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from 'components/App'
import { QueryClient, QueryClientProvider } from 'react-query'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
