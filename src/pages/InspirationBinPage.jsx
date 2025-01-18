import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaBox } from 'react-icons/fa'; // Import the FaBox icon
import ProjectCard from '../components/ProjectCard'; // Import the ProjectCard component

const InspirationBinPage = ({ setSelectedProject }) => {
  const { user, isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Define strippedSub to extract the user ID
        const strippedSub = user.sub.replace(/.*\|/, '');
        setUserId(strippedSub);
        console.log('Logged-in User ID:', strippedSub);

        // Fetch all creators from Firestore
        const creatorsSnapshot = await getDocs(collection(db, 'creators')); // Ensure the collection name is correct
        const creatorsData = creatorsSnapshot.docs.map(doc => doc.data());

        // Filter projects in the inspiration bin for the logged-in user
        const userCreator = creatorsData.find(creator => creator.auth0Id === strippedSub);
        const userProjectRefs = userCreator ? userCreator['Inspiration-bin'] || [] : [];

        // Fetch project details based on references
        const projectPromises = userProjectRefs.map(ref => getDoc(doc(db, ref.path)));
        const projectDocs = await Promise.all(projectPromises);
        const projectData = await Promise.all(projectDocs.map(async (doc) => {
          const project = { id: doc.id, ...doc.data() };

          // Fetch creators for each project
          const creatorPromises = project.creators.map(creatorRef => getDoc(creatorRef));
          const creatorDocs = await Promise.all(creatorPromises);
          project.creators = creatorDocs.map(creatorDoc => ({ id: creatorDoc.id, ...creatorDoc.data() }));

          // Fetch products/services for each project
          const servicePromises = project.ProductsAndServices.map(serviceRef => getDoc(serviceRef));
          const serviceDocs = await Promise.all(servicePromises);
          project.ProductsAndServices = serviceDocs.map(serviceDoc => ({ id: serviceDoc.id, ...serviceDoc.data() }));

          return project;
        }));

        setProjects(projectData);
        console.log('User Projects in Inspiration Bin:', projectData);
      } catch (err) {
        console.error('Error fetching creators or projects:', err);
      }
    };

    if (isAuthenticated && user) {
      fetchProjects();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <div className="flex items-center mb-6">
        <FaBox className="text-blue-500 text-3xl mr-2" />
        <h1 className="text-3xl font-bold text-blue-500">Inspiration Bin</h1>
      </div>
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">Your Inspiration Bin is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
            />
          ))}
        </div>
      )}
      {/* Add your JSX content here */}
    </div>
  );
};

export default InspirationBinPage;