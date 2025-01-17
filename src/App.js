// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Ensure this import is present
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MyProjectsPage from './pages/MyProjectsPage';
import SubmitProjectPage from './pages/SubmitProjectPage';
import ProjectModal from './components/ProjectModal';
import useProjects from './hooks/useProjects'; // Import the useProjects hook
import InspirationBinPage from './pages/InspirationBinPage'; // Added import

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0(); // Ensure correct destructuring
  const [selectedProject, setSelectedProject] = useState(null);

  // Use the useProjects hook to get projects with creators
  const { projects, loading, error: projectsError } = useProjects();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || loading) { // Combine Auth0 and project loading states
    return <div>Loading...</div>;
  }

  if (error || projectsError) { // Combine Auth0 and project error states
    console.error('Error:', error || projectsError);
    return <div>Oops! Something went wrong: {(error || projectsError).message}</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  console.log('All Projects:', projects); // Debug log

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <NavBar
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        loginWithRedirect={loginWithRedirect}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/my-projects"
          element={isAuthenticated ? <MyProjectsPage /> : <Navigate to="/" replace />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/submit"
          element={isAuthenticated ? <SubmitProjectPage /> : <Navigate to="/" replace />}
        />
        {/* Update the Inspiration Bin route path */}
        <Route
          path="/inspirationbin"
          element={isAuthenticated ? <InspirationBinPage setSelectedProject={setSelectedProject} /> : <Navigate to="/" replace />}
        />
      </Routes>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default App;