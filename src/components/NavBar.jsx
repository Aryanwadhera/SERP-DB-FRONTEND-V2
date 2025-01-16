// NavBar Component
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function NavBar({ user, isAuthenticated, logout, loginWithRedirect }) {
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <img 
            src="/serpdb_black.png" 
            alt="SERP DB Black Logo" 
            className="h-8 w-auto object-contain logo-light" 
          />
          <img 
            src="/serpdb_white.png" 
            alt="SERP DB White Logo" 
            className="h-8 w-auto object-contain logo-dark" 
          />
          <img 
            src="/estem_logo.png" 
            alt="ESTEM Logo" 
            className="h-8 w-auto object-contain" 
          />
        </div>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          {isAuthenticated ? (
            <>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.picture} alt="User Avatar" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li><Link to="/my-projects">My Projects</Link></li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;