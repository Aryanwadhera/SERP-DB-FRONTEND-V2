// src/components/ProjectModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// A styled container that applies glow if props.glow === true
const GlowingContainer = styled(motion.div)`
  ${(props) =>
    props.glow &&
    `
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: -2px;
      top: -2px;
      border-radius: 10px;
      background: linear-gradient(
        45deg,
        #fb0094,
        #0000ff,
        #00ff00,
        #ffff00,
        #ff0000,
        #fb0094,
        #0000ff,
        #00ff00,
        #ffff00,
        #ff0000
      );
      background-size: 400%;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      z-index: -1;
      animation: steam 15s linear infinite;
    }
    &:after {
      filter: blur(100px);
    }

    @keyframes steam {
      0% {
        background-position: 0 0;
      }
      50% {
        background-position: 400% 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  `}
`;

const ProjectModal = ({ project, onClose }) => {
  console.log('ProjectModal Props:', project); // Debug log
  const [glowActive, setGlowActive] = useState(false);

  if (!project) return null; // no project => no modal

  const updatedDate = new Date(project.lastUpdated.seconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shouldGlow = glowActive && project.isProjectOfTheYear;

  console.log('Project Modal - Title:', project.title); // New Debug log
  console.log('Project Modal - Description:', project.description); // Existing Debug log
  console.log('Project Modal - Services:', project.ProductsAndServices); // Existing Debug log
  console.log('Project Modal - Technologies:', project.technologies); // New Debug log
  console.log('Project Modal - Creators:', project.creators); // New Debug log

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <GlowingContainer
        glow={shouldGlow}
        className="relative max-w-xl w-full mx-4 bg-base-100 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onAnimationComplete={() => setGlowActive(true)}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-base-content/70 hover:text-base-content/100 transition-colors btn btn-square btn-ghost"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M13.414 12l5.293-5.293a1 1 0 1 0-1.414-1.414L12 10.586 
                 6.707 5.293A1 1 0 1 0 5.293 6.707L10.586 12l-5.293 
                 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 
                 5.293a1 1 0 1 0 1.414-1.414L13.414 12z"
            />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="max-h-[80vh] overflow-y-auto">
          <figure className="h-64 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-3xl font-semibold mb-2">{project.title}</h3>
              <p className="text-base text-base-content/80 leading-relaxed">
                {project.description ? (
                  project.description
                ) : (
                  'No detail info available.'
                )}
              </p>
            </div>

            {/* Status and Project Info */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Status</p>
                <p className="font-semibold">{project.status}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70 mb-1">School Year</p>
                <p className="font-semibold">{project.schoolYear}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70 mb-1">Cost</p>
                <p className="font-semibold">{project.cost}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70 mb-1">Category</p>
                <p className="font-semibold">{project.category}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70 mb-1">Complexity</p>
                <p className="font-semibold">{project.complexity}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70 mb-1">Last Updated</p>
                <p className="font-semibold">{updatedDate}</p>
              </div>
            </div>

            {/* If everWonProjectOfTheYear => show the alert info */}
            {project.everWonProjectOfTheYear && (
              <div
                role="alert"
                className="alert alert-info flex items-center space-x-3 p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01
                       M21 12a9 9 0 1 1-18 0 9 9 
                       0 0 1 18 0z"
                  ></path>
                </svg>
                <span>
                  This Project <strong>Won</strong> Project of the Year in{' '}
                  {project.schoolYear}
                </span>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <p className="text-sm text-base-content/70 mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="badge badge-sm bg-base-300 text-base-content/80 border-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products and Services */}
            {Array.isArray(project.ProductsAndServices) && project.ProductsAndServices.length > 0 ? (
              <div>
                <h4 className="text-xl font-semibold mb-2">Products and Services</h4>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Cost per Unit</th>
                      <th>Quantity</th>
                      <th>Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.ProductsAndServices.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.costperunit !== undefined ? item.costperunit.toFixed(2) : 'N/A'}</td>
                        <td>{item.quantity}</td>
                        <td>{item.reason}</td>
                        <td>
                          <button
                            onClick={() => window.open(item.link, '_blank')}
                            className="btn btn-sm btn-primary"
                          >
                            Learn More
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No services available for this project.</p>
            )}

            {/* Creators */}
            <div>
              <p className="text-sm text-base-content/70 mb-2">Creators</p>
              {project.creators.length > 0 ? (
                <div className="space-y-4">
                  {project.creators.map(creator => (
                    <div
                      key={creator.id}
                      className="p-4 bg-base-50 rounded-lg flex items-start space-x-4 shadow-sm"
                    >
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold">{creator.Name}</h4>
                        <p className="text-sm text-base-content/70">
                          {creator.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No creators assigned to this project.</p>
              )}
            </div>

            <div className="pt-6 flex justify-between items-center">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                View Project
              </a>
              <button className="btn btn-sm btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </GlowingContainer>
    </div>
  );
};

export default ProjectModal;
