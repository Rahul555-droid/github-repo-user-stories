import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ArrowLeftIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

// Mock data for commits and release notes
const mockCommits = [
  { id: '1', message: 'Fix critical bug in authentication', author: 'johndoe', date: '2023-06-15' },
  { id: '2', message: 'Add new feature: dark mode', author: 'janedoe', date: '2023-06-14' },
  { id: '3', message: 'Update dependencies', author: 'bobsmith', date: '2023-06-13' },
]

const mockReleaseNotes = [
  {
    version: 'v2.1.0',
    date: '2023-06-10',
    notes: [
      'Implemented dark mode',
      'Fixed several UI bugs',
      'Improved performance by 20%',
    ]
  },
  {
    version: 'v2.0.1',
    date: '2023-05-28',
    notes: [
      'Hotfix for authentication issue',
      'Minor UI improvements',
    ]
  },
]

function RepoDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const repo = location.state?.repo

  if (!repo) {
    return <div>Repository not found</div>
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GitHubLogoIcon className="h-6 w-6" />
            {repo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{repo.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Latest Version</h3>
              <p>{repo.latestRelease?.version}</p>
            </div>
            <div>
              <h3 className="font-semibold">Last Updated</h3>
              <p>{repo.releaseDate}</p>
            </div>
            <div>
              <h3 className="font-semibold">Stars</h3>
              <p>{repo.stars?.toLocaleString() || '313' }</p>
            </div>
            <div>
              <h3 className="font-semibold">Forks</h3>
              <p>{repo.forks?.toLocaleString() || '200' }</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Open Issues</h3>
            <p>{repo.openIssues?.toLocaleString() || '10' }</p>
          </div>
        </CardContent>
      </Card>

      <Accordion type='multiple'  className="w-full">
        <AccordionItem value="commits" >
          <AccordionTrigger>Recent Commits</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4">
              {mockCommits.map((commit) => (
                <li key={commit.id} className="border-b pb-2">
                  <p className="font-medium">{commit.message}</p>
                  <p className="text-sm text-muted-foreground">
                    By {commit.author} on {commit.date}
                  </p>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="releases">
          <AccordionTrigger>Release Notes</AccordionTrigger>
          <AccordionContent>
            {mockReleaseNotes.map((release) => (
              <div key={release.version} className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {release.version}
                  <Badge variant="secondary">{release.date}</Badge>
                </h3>
                <ul className="list-disc pl-5 mt-2">
                  {release.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default RepoDetail

