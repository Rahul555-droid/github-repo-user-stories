import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import RepoDetail from './components/RepoDetail'
import { RepoList } from './components/RepoList'
import { useAuth } from './Providers/AuthProvider'
import { LoginBanner } from './components/LoginBanner'

const Root: React.FC = () => {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Header />
      {user ? (
        <main className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<RepoList />} />
            <Route path="/repo/:id" element={<RepoDetail />} />
          </Routes>
        </main>
      ) : (!loading && <LoginBanner />) }
    </div>
  )
}

export default Root
