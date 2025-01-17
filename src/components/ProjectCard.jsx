import React from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, onClick }) => {
  console.log('ProjectCard Props:', project); // Debug log

  if (!project) return null; // Ensure project data is available

  // Add debug log to check individual project fields
  console.log('Project Details:', {
    id: project.id,
    title: project.title,
    image: project.image,
    description: project.description,
    technologies: project.technologies,
    creators: project.creators,
    ProductsAndServices: project.ProductsAndServices,
  }); // New Debug log

  return (
    <motion.div
      className="card bg-base-100 shadow-xl rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <figure className="h-48 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </figure>
      <div className="card-body px-4 py-3 space-y-2">
        <h3 className="card-title text-lg font-semibold">{project.title || 'Untitled Project'}</h3>
        <p className="text-sm text-base-content/70">
          {project.description ? project.description : 'No description available.'}
        </p>
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex gap-2 justify-start mt-2 flex-wrap">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="badge badge-sm bg-base-300 text-base-content/70 border-none"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {/* Creators */}
        {project.creators && project.creators.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Creators:</h4>
            <ul className="list-disc list-inside">
              {project.creators.map((creator, i) => (
                <li key={i} className="text-sm text-base-content/70">
                  {creator.Name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Products and Services */}
        {project.ProductsAndServices && project.ProductsAndServices.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Products and Services:</h4>
            <ul className="list-disc list-inside">
              {project.ProductsAndServices.map((service, i) => (
                <li key={i} className="text-sm text-base-content/70">
                  {service.name} - ${service.costperunit.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card-actions justify-end">
          <button onClick={onClick} className="btn btn-primary">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
