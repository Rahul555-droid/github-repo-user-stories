
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ADD_REPOSITORY } from "@/graphql/mutations"
import { GET_REPOSITORIES } from "@/graphql/queries"
import { useMutation, useQuery } from '@apollo/client'
import { PlusIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { RepoCard } from "./RepoCard"

export function RepoList() {
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const { data, loading, error, refetch } = useQuery(GET_REPOSITORIES);
  const [addRepository] = useMutation(ADD_REPOSITORY);

  const handleAddRepo = async () => {
    if (!newRepoUrl) return;

    try {
      await addRepository({ variables: { url: newRepoUrl } });
      setNewRepoUrl("");
      refetch();
    } catch (err) {
      console.error("Error adding repository:", err);
    }
  };

  const filteredRepos = useMemo(() => {
    if (!data?.getRepositories) return [];
    return data.getRepositories.filter((repo: any) => {
      if (filter === "all") return true;
      if (filter === "seen") return repo.releases.every((release: any) => release.seen);
      if (filter === "unseen") return repo.releases.some((release: any) => !release.seen);
      return true;
    });
  }, [data, filter]);

  const sortedRepos = useMemo(() => {
    return [...filteredRepos].sort((a: any, b: any) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "date") {
        const aDate = new Date(a.releases?.[0]?.releaseDate || 0).getTime();
        const bDate = new Date(b.releases?.[0]?.releaseDate || 0).getTime();
        return bDate - aDate;
      }
      return 0;
    });
  }, [filteredRepos, sort]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      {/* Add Repository */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Add repository URL"
          value={newRepoUrl}
          onChange={(e) => setNewRepoUrl(e.target.value)}
          className="flex-grow rounded-full"
        />
        <Button onClick={handleAddRepo} className="rounded-full w-full sm:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Repo
        </Button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
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
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Repository Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedRepos.map((repo: any) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}

