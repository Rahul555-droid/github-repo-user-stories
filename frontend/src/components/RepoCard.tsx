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
import { FETCH_LATEST_RELEASE, MARK_RELEASE_AS_SEEN } from '@/graphql/mutations'
import { useMutation } from '@apollo/client'
import { EyeNoneIcon, EyeOpenIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Repo {
  id: number
  name: string
  description: string
  latestVersion: string
  lastUpdated: string
  seen: boolean
}

export function RepoCard({ repo }: { repo: Repo }) {
  const [seen, setSeen] = useState(repo.seen)
  const [fetchLatestRelease] = useMutation(FETCH_LATEST_RELEASE)
  const [markReleaseAsSeen] = useMutation(MARK_RELEASE_AS_SEEN)

  // Handle marking a release as seen
  const handleMarkAsSeen = async (releaseId: string) => {
    try {
      await markReleaseAsSeen({ variables: { releaseId } });
      // refetch() // Refresh the release data
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        seen
          ? 'bg-card'
          : 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary'
      }`}
    >
      <Link to={`/repo/${repo.id}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GitHubLogoIcon className="h-5 w-5" />
              {repo.name}
            </span>
            {!seen && (
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
            <span className="font-semibold">v{repo.latestVersion}</span>
            <span className="text-muted-foreground">{repo.lastUpdated}</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <Button
          variant={seen ? 'outline' : 'default'}
          className="w-full rounded-full transition-all duration-300"
          onClick={(e) => {
            e.preventDefault()
            setSeen(!seen)
          }}
        >
          {seen ? (
            <>
              <EyeOpenIcon className="mr-2 h-4 w-4" /> Marked as Seen
            </>
          ) : (
            <>
              <EyeNoneIcon className="mr-2 h-4 w-4" /> Mark as Seen
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
