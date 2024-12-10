import { ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import RepoDetail from './components/RepoDetail';
import { RepoList } from './components/RepoList';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Replace with your backend URL if different
  cache: new InMemoryCache(),
});



// const App: React.FC = () => {
//   const [newRepo, setNewRepo] = useState({  url: '' });
//   const { loading, error, data, refetch } = useQuery(GET_REPOSITORIES);
//   const [addRepository] = useMutation(ADD_REPOSITORY);
//   const [fetchLatestRelease] = useMutation(FETCH_LATEST_RELEASE);
//   const [markReleaseAsSeen] = useMutation(MARK_RELEASE_AS_SEEN);

//   // Handle adding a new repository
//   const handleAddRepository = async () => {
//     try {
//       await addRepository({ variables: newRepo });
//       refetch(); // Refresh the repository list
//       setNewRepo({ url: '', });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle fetching the latest release
//   const handleFetchLatestRelease = async (repositoryId: string) => {
//     try {
//       await fetchLatestRelease({ variables: { repositoryId } });
//       refetch(); // Refresh the repository data
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle marking a release as seen
//   const handleMarkAsSeen = async (releaseId: string) => {
//     try {
//       await markReleaseAsSeen({ variables: { releaseId } });
//       refetch(); // Refresh the release data
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>Aspire Repository Tracker</h1>

//       {/* Add Repository Form */}
//       <div>
//         <h2>Add Repository</h2>

//         <input
//           type="text"
//           placeholder="URL"
//           value={newRepo.url}
//           onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
//         />

//         <button onClick={handleAddRepository}>Add Repository</button>
//       </div>

//       {/* Repository List */}
//       <div>
//         <h2>Tracked Repositories</h2>
//         {data.getRepositories.map((repo: any) => (
//           <div key={repo.id}>
//             <h3>{repo.name}</h3>
//             <p>{repo.description}</p>
//             <p>
//               <a href={repo.url} target="_blank" rel="noopener noreferrer">
//                 {repo.url}
//               </a>
//             </p>
//             <button onClick={() => handleFetchLatestRelease(repo.id)}>
//               Fetch Latest Release
//             </button>

//             {/* Release List */}
//             {repo.releases.map((release: any) => (
//               <div key={release.id}>
//                 <p>
//                   Version: {release.version} | Date: {new Date(release.releaseDate).toLocaleDateString()}
//                 </p>
//                 {!release.seen && (
//                   <button onClick={() => handleMarkAsSeen(release.id)}>Mark as Seen</button>
//                 )}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Wrap App in ApolloProvider
const Root: React.FC = () => (
  <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          <Header />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<RepoList />} />
              <Route path="/repo/:id" element={<RepoDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
  </ApolloProvider>
);

export default Root;



