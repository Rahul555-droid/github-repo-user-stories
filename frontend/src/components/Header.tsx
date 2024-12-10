import DarkModeToggle from './DarkModeToggle'
import { useAuth } from '@/Providers/AuthProvider'
import React from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function Header() {
  const { user, login, logout } = useAuth()
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className='flex justify-start gap-1' >
          <h1 className="text-2xl font-bold bg-clip-text from-primary to-primary-foreground">
            GitHub Issue Tracker
          </h1>
          <DarkModeToggle />
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback>
                  {user.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user.login}</span>
              <Button onClick={logout}
                        className="rounded-full w-full sm:w-auto"
              >
                Log out
              </Button>
            </div>
          ) : (
            <Button onClick={login}>Log in with GitHub</Button>
          )}
        </div>
      </div>
    </header>
  )
}
