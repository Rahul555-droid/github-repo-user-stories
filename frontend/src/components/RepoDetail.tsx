import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeftIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

const repoData = {
  1: { id: 1, name: "react", description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.", latestVersion: "18.2.0", lastUpdated: "2023-06-15", seen: true, stars: 203000, forks: 42000, openIssues: 1050 },
  2: { id: 2, name: "next.js", description: "The React Framework for the Web", latestVersion: "13.4.7", lastUpdated: "2023-06-20", seen: false, stars: 105000, forks: 24000, openIssues: 1500 },
  3: { id: 3, name: "typescript", description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.", latestVersion: "5.1.3", lastUpdated: "2023-06-18", seen: true, stars: 89000, forks: 12000, openIssues: 5600 },
};

function RepoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const repo = repoData[Number(id)];

  if (!repo) {
    return <div>Repository not found</div>;
  }

  return (
    <>
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
              <p>{repo.latestVersion}</p>
            </div>
            <div>
              <h3 className="font-semibold">Last Updated</h3>
              <p>{repo.lastUpdated}</p>
            </div>
            <div>
              <h3 className="font-semibold">Stars</h3>
              <p>{repo.stars.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Forks</h3>
              <p>{repo.forks.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Open Issues</h3>
            <p>{repo.openIssues.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default RepoDetail;

