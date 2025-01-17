// src/pages/MyProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useProjects from '../hooks/useProjects';
// Remove the ProjectCard import
// import ProjectCard from '../components/ProjectCard';

const MyProjectsPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { projects, loading, error } = useProjects();
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // 1) Grab the raw user.sub from Auth0
      console.log('Raw user.sub:', user.sub);

      // 2) Remove any prefix (like "google-oauth2|" or "auth0|")
      //    This regex strips everything up to the LAST '|' (if any).
      //    If user.sub = "google-oauth2|118170320184413952065",
      //    then strippedSub = "118170320184413952065"
      const strippedSub = user.sub.replace(/.*\|/, '');
      console.log('Stripped user.sub:', strippedSub);

      // 3) Filter projects so only those whose creator.auth0Id === strippedSub
      const filtered = projects.filter((project) =>
        project.creators.some(
          (creator) => creator.auth0Id === strippedSub
        )
      );

      setMyProjects(filtered);
      console.log('My Projects:', filtered); // Debug log
    }
  }, [loading, isAuthenticated, user, projects]);

  if (loading) return <div>Loading your projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  // Add debug log to check myProjects state
  console.log('Rendered My Projects:', myProjects); // New Debug log

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">My Projects</h1>
      <p className="text-base-content/70">
        Here are the projects you have submitted.
      </p>
      <div className="flex flex-wrap gap-6">
        {myProjects.map((p) => (
          // Replace ProjectCard with a simple div or your preferred component
          <div key={p.id} className="bg-base-100 shadow-xl rounded-xl p-4">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-base-content/70">{p.description}</p>
            <button
              onClick={() => alert(`Request edit for project: ${p.title}`)}
              className="btn btn-primary mt-2"
            >
              Request Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProjectsPage;
