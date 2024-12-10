'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { EyeNoneIcon, EyeOpenIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { release } from 'os'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface Repo {
  id: string
  name: string
  description: string
  url: string
  releaseDate: string
  seen: Boolean
  latestRelease: any
  releases: any[]
}

export function RepoCard({
  repo,
  handleMarkAsSeen
}: {
  repo: Repo
  handleMarkAsSeen: Function
}) {
  console.log({ repo })
  const handleSeenClick = async () => {
    await handleMarkAsSeen(repo.id, repo.latestRelease.id)
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        repo.seen
          ? 'bg-card'
          : 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary'
      }`}
    >
      <Link to={`/repo/${repo.id}`} state={{ repo }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GitHubLogoIcon className="h-5 w-5" />
              {repo.name}
            </span>
            {!repo.seen && (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                New
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {repo.description}
          </p>
          <div className="mt-4 flex justify-between text-sm">
            <span className="font-semibold">
              {repo?.latestRelease?.version}
            </span>
            <span className="text-muted-foreground">{repo?.releaseDate}</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <Button
          variant={'default'}
          className={`w-full rounded-full transition-all duration-300 ${
            repo.seen ? 'invisible' : 'visible'
          } `}
          onClick={handleSeenClick}
        >
          <EyeNoneIcon className="mr-2 h-4 w-4" /> Mark as Seen
        </Button>
      </CardFooter>
    </Card>
  )
}
