import React from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, onClick }) => {
  console.log('Project Card - Description:', project.description); // Debugging log
  
  return (
    <motion.div
      className="card bg-base-100 w-72 shadow-xl rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow"
      onClick={() => onClick && onClick(project)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <figure className="h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body px-4 py-3 space-y-2">
        <h3 className="card-title text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-base-content/70">
          {project.description ? project.description : 'No description available.'}
        </p>
        <div className="flex gap-2 justify-start mt-2 flex-wrap">
          {project.tags.map((tag, i) => (
            <span 
              key={i} 
              className="badge badge-sm bg-base-300 text-base-content/70 border-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
