import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

interface User {
  id: number
  login: string
  avatar_url: string
}

interface AuthContextType {
  user: User | null
  login: () => void
  logout: () => void
  loading : boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading , setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('http://localhost:4000/auth/me', {
        withCredentials: true
      })
      setUser(data.user)
      setLoading(false)
    } catch {
      setLoading(false)
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = () => {
    window.location.href = 'http://localhost:4000/auth/github'
  }

  const logout = async () => {
    document.cookie = 'github_token=; Max-Age=0'
    document.cookie = 'github_user=; Max-Age=0'
    setUser(null)
    const response = await axios.get('http://localhost:4000/auth/logout', {
      withCredentials: true
    })
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ user, login, logout , loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
