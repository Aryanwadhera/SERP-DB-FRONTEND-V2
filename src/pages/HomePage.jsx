// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import Loader from '../components/Loader';
import ProjectModal from '../components/ProjectModal';

const categorizeProjects = (project) => {
  const tags = project.tags || [];
  const lowerTags = tags.map((tag) => tag.toLowerCase());

  if (lowerTags.includes('engineering')) return 'Engineering';
  if (lowerTags.includes('biology') || lowerTags.includes('chemistry')) return 'Science';
  if (lowerTags.includes('technology')) return 'Technology';
  if (lowerTags.includes('math') || lowerTags.includes('mathematics')) return 'Mathematics';
  return 'Other';
};

const HomePage = () => {
  const { projects, loading, error } = useProjects();

  // Local states
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCost, setFilterCost] = useState('All');
  const [filterSchoolYear, setFilterSchoolYear] = useState('All');
  // Show/hide filters on mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debug log to check selected project data
  const handleProjectSelect = (project) => {
    console.log('Selected Project:', project);
    setSelectedProject(project);
  };

  // 1) If still loading => new Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 text-base-content">
        <Loader />
      </div>
    );
  }

  // 2) If error => show message
  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">Error: {error.message}</div>
    );
  }

  // Identify Project of the Year
  const projectOfTheYear = projects.find((p) => p.isProjectOfTheYear);

  // For school year dropdown
  const schoolYearOptions = [
    ...new Set(projects.map((proj) => proj.schoolYear).filter(Boolean)),
  ];

  // Categorize
  const categorizedProjects = projects.map((project) => ({
    ...project,
    category: categorizeProjects(project),
  }));

  // Filter logic
  const filteredProjects = categorizedProjects.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'All' || p.category === filterCategory;

    // Convert cost from '$340' => 340
    let numericCost = 0;
    if (typeof p.cost === 'string') {
      numericCost = parseFloat(p.cost.replace(/[^0-9.-]+/g, '')) || 0;
    }

    let matchesCost = true;
    if (filterCost === 'Low') {
      matchesCost = numericCost <= 100;
    } else if (filterCost === 'Medium') {
      matchesCost = numericCost > 100 && numericCost <= 500;
    } else if (filterCost === 'High') {
      matchesCost = numericCost > 500;
    }

    const matchesSchoolYear =
      filterSchoolYear === 'All' || p.schoolYear === filterSchoolYear;

    return matchesSearch && matchesCategory && matchesCost && matchesSchoolYear;
  });

  console.log('Filtered Projects:', filteredProjects); // Debugging log

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Welcome Section */}
      <section className="w-full px-4 md:px-12 py-8 md:py-16">
        <div className="max-w-6xl mx-auto text-left space-y-6">
          <motion.h1
            className="text-3xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Welcome to SERP DB
          </motion.h1>
          <motion.p
            className="text-base-content/70 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            A database of Science Engineering Research Projects made by students
            attending Eastvale STEM Academy.
          </motion.p>
          <motion.div
            className="flex space-x-4 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            <Link to="/submit" className="btn btn-primary px-6 rounded-full">
              Submit a Project
            </Link>
            <Link to="/my-projects" className="btn btn-ghost px-6 rounded-full">
              My Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Project of the Year */}
      {projectOfTheYear && (
        <section className="w-full px-4 md:px-12 pb-8 md:pb-16">
          <div className="max-w-6xl mx-auto text-left">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Project of the Year
            </motion.h2>
            <motion.div
              className="card flex flex-col lg:flex-row bg-base-100 shadow-xl w-full overflow-hidden cursor-pointer"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
              }}
              onClick={() => handleProjectSelect(projectOfTheYear)}
            >
              <figure className="relative lg:w-1/3 min-w-[150px] overflow-hidden h-48 lg:h-auto">
                <motion.img
                  src={projectOfTheYear.image}
                  alt={projectOfTheYear.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </figure>
              <div className="card-body lg:w-2/3">
                <h2 className="card-title text-xl md:text-2xl font-bold">
                  {projectOfTheYear.title}
                </h2>
                {projectOfTheYear.description && (
                  <p className="text-base text-base-content/70">
                    {projectOfTheYear.description}
                  </p>
                )}
                <p className="text-sm text-base-content/50">
                  School Year: {projectOfTheYear.schoolYear}
                </p>

                {/* Creators */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Creators:</h3>
                  <div className="flex flex-wrap gap-4">
                    {projectOfTheYear.creators?.map((creator) => (
                      <div key={creator.id} className="flex items-center space-x-2">
                        <img
                          src={creator.image}
                          alt={creator.Name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">
                          {creator.Name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Mobile Filters Toggle Button */}
      <section className="w-full px-4 md:px-12 pb-4 md:pb-0">
        <div className="max-w-6xl mx-auto">
          <button
            className="btn btn-outline mb-4 block md:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Filters (collapsible on mobile) */}
          <div
            className={`${
              showMobileFilters ? 'block' : 'hidden'
            } md:block md:w-1/4`}
          >
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            <div className="space-y-4">
              <button
                className={`btn btn-block ${
                  filterCategory === 'All' ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setFilterCategory('All')}
              >
                All
              </button>
              <button
                className={`btn btn-block ${
                  filterCategory === 'Engineering' ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setFilterCategory('Engineering')}
              >
                Engineering
              </button>
              <button
                className={`btn btn-block ${
                  filterCategory === 'Science' ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setFilterCategory('Science')}
              >
                Science
              </button>
              <button
                className={`btn btn-block ${
                  filterCategory === 'Technology' ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setFilterCategory('Technology')}
              >
                Technology
              </button>
              <button
                className={`btn btn-block ${
                  filterCategory === 'Mathematics' ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setFilterCategory('Mathematics')}
              >
                Mathematics
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Cost</h3>
              <div className="space-y-4">
                <button
                  className={`btn btn-block ${
                    filterCost === 'All' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setFilterCost('All')}
                >
                  All
                </button>
                <button
                  className={`btn btn-block ${
                    filterCost === 'Low' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setFilterCost('Low')}
                >
                  Low (≤ $100)
                </button>
                <button
                  className={`btn btn-block ${
                    filterCost === 'Medium' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setFilterCost('Medium')}
                >
                  Medium ($101 - $500)
                </button>
                <button
                  className={`btn btn-block ${
                    filterCost === 'High' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setFilterCost('High')}
                >
                  High (≥ $501)
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">School Year</h3>
              <select
                className="select select-bordered w-full"
                value={filterSchoolYear}
                onChange={(e) => setFilterSchoolYear(e.target.value)}
              >
                <option value="All">All</option>
                {schoolYearOptions.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtered Projects */}
          <div className="md:w-3/4">
            <motion.h2
              className="text-3xl font-semibold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Filtered Projects
            </motion.h2>
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="Search projects..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="card bg-base-100 shadow-xl cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
                  }}
                  onClick={() => handleProjectSelect(project)}
                >
                  <figure className="h-32 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-lg font-bold">
                      {project.title}
                    </h2>
                    <p className="text-sm text-base-content/70">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
