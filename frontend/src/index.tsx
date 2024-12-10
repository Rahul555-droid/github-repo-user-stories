// @ts-nocheck
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './Providers/AuthProvider'
import 'tailwindcss/tailwind.css'
import './index.css'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const queryClient = new QueryClient()

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Your GraphQL endpoint
  credentials: 'include', // This ensures cookies are sent with the request
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})


root.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </ApolloProvider>
)
