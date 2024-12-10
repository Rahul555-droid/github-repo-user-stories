import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ADD_REPOSITORY,
  MARK_RELEASE_AS_SEEN,
  REFRESH_REPOSITORIES
} from '@/graphql/mutations'
import { GET_USER_REPOSITORIES } from '@/graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { PlusIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'
import { RepoCard } from './RepoCard'

export function RepoList() {
  const [newRepoUrl, setNewRepoUrl] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, loading, error, refetch } = useQuery(GET_USER_REPOSITORIES)
  const [addRepository] = useMutation(ADD_REPOSITORY)
  const [markReleaseAsSeen] = useMutation(MARK_RELEASE_AS_SEEN)
  const [refreshRepositories] = useMutation(REFRESH_REPOSITORIES)

  const handleAddRepo = async () => {
    if (!newRepoUrl) return

    try {
      await addRepository({ variables: { url: newRepoUrl } })
      setNewRepoUrl('')
      refetch()
    } catch (err) {
      console.error('Error adding repository:', err)
    }
  }

  const handleMarkAsSeen = async (repositoryId: string, releaseId: string) => {
    try {
      await markReleaseAsSeen({ variables: { repositoryId, releaseId } })
      refetch() // Refresh release statuses
    } catch (err) {
      console.error('Error marking release as seen:', err)
    }
  }

  const handleRefreshAll = async () => {
    try {
      // Trigger the refreshAll mutation
      const response = await refreshRepositories()
      console.log({ response })
      refetch()
    } catch (err) {
      console.error('Error refreshing repositories:', err)
    }
  }

  const cleanReposData = useMemo(
    () =>
      data?.getUserRepositories
        ?.map((el: any) => {
          const { repository, seenReleases } = el || {}
          const latestRelease = repository?.releases?.slice(-1)[0] // Get the last release
          return repository
            ? {
                ...repository,
                seenReleases,
                seen: seenReleases?.length
                  ? latestRelease
                    ? seenReleases.includes(latestRelease.id)
                    : true
                  : false,
                latestRelease,
                releaseDate: latestRelease?.releaseDate
                  ? new Date(Number(latestRelease.releaseDate))
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
            : null
        })
        .filter(Boolean) || [], // Filter out null and fallback to an empty array
    [data]
  )

  const filteredRepos = useMemo(() => {
    if (!cleanReposData.length) return []
    if (filter === 'all') return cleanReposData
    return cleanReposData.filter((rep: any) =>
      filter === 'seen' ? rep.seen : !rep.seen
    )
  }, [cleanReposData, filter])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      {/* Add Repository */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Add repository URL"
          value={newRepoUrl}
          onChange={(e) => setNewRepoUrl(e.target.value)}
          // className="flex-grow rounded-full"
          className="flex-grow rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md"
        />
        <Button
          onClick={handleAddRepo}
          className="rounded-full w-full sm:w-auto"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Repo
        </Button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="seen">Seen</SelectItem>
            <SelectItem value="unseen">Unseen</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleRefreshAll} className="rounded-full">
          Refresh All Repositories
        </Button>
      </div>

      {/* Repository Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRepos.map((repo: any) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            handleMarkAsSeen={handleMarkAsSeen}
          />
        ))}
      </div>
    </div>
  )
}
