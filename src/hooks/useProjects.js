import { useState, useEffect } from 'react'; // Removed 'useCallback'
import { db } from '../firebase';
import { collection, getDocs, getDoc } from "firebase/firestore"; // Removed 'query', 'where', 'documentId'

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsAndCreatorsAndServices = async () => {
      try {
        // Fetch Projects from Firestore
        const projectsSnapshot = await getDocs(collection(db, 'Projects'));

        const projectsData = projectsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('useProjects - raw project data:', data); // Added debug log
          return { 
            id: doc.id, 
            ...data,
            description: data.description || '', // Remove fallback to 'detailInfo'
            technologies: data.technologies || [] // Ensure 'technologies' exists, otherwise set to empty array
          };
        });

        console.log('Fetched Projects:', projectsData);

        // Fetch Creators and Services for each project
        const finalProjects = await Promise.all(projectsData.map(async project => {
          // Handle Creators
          const creatorRefs = Array.isArray(project.creators) ? project.creators : [];

          console.log(`Project ID ${project.id} Creator References:`, creatorRefs);

          const projectCreators = await Promise.all(creatorRefs.map(async (creatorRef) => {
            const creatorDoc = await getDoc(creatorRef);
            if (creatorDoc.exists()) {
              return { id: creatorDoc.id, Name: creatorDoc.data().Name, ...creatorDoc.data() };
            } else {
              console.warn(`Creator referenced in Project ID ${project.id} does not exist.`);
              return null;
            }
          }));

          const validCreators = projectCreators.filter(Boolean);

          console.log(`Project ID ${project.id} Creators:`, validCreators);

          // Handle Services
          const serviceRefs = Array.isArray(project.ProductsAndServices) ? project.ProductsAndServices : [];

          console.log(`Project ID ${project.id} Service References:`, serviceRefs);

          const projectServices = await Promise.all(serviceRefs.map(async (serviceRef) => {
            const serviceDoc = await getDoc(serviceRef);
            if (serviceDoc.exists()) {
              const serviceData = serviceDoc.data();

              // Convert fields as necessary
              const costperunit = typeof serviceData.costperunit === 'string' ? parseFloat(serviceData.costperunit) : serviceData.costperunit;
              const quantity = typeof serviceData.quantity === 'string' ? parseInt(serviceData.quantity, 10) : serviceData.quantity;

              // Validate required fields
              const { name, reason, link } = serviceData;
              if (!name || costperunit == null || !reason || !link) {
                console.warn(`Service ID ${serviceDoc.id} is missing one or more required fields.`);
                return null; // Skip services with incomplete data
              }

              return {
                id: serviceDoc.id,
                name,
                costperunit,
                quantity,
                reason,
                link,
              };
            } else {
              console.warn(`Service referenced in Project ID ${project.id} does not exist.`);
              return null;
            }
          }));

          const validServices = projectServices.filter(Boolean);

          console.log(`Project ID ${project.id} Services:`, validServices);

          console.log(`Final Project Data for ID ${project.id}:`, {
            ...project,
            creators: validCreators,
            ProductsAndServices: validServices,
          }); // Debug log

          return {
            ...project,
            creators: validCreators,
            // Rename 'services' to 'ProductsAndServices'
            ProductsAndServices: validServices,
          };
        }));

        console.log('Final Projects with Creators, Services, and Description:', finalProjects); // Debug log

        setProjects(finalProjects);
      } catch (error) {
        console.error('Error fetching projects, creators, or services:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndCreatorsAndServices();
  }, []);

  // Remove the getProjectsByReferences function if it's only used for the Inspiration Bin
  // const getProjectsByReferences = useCallback(async (projectIds) => {
  //   // ...existing code...
  // }, []);

  return { projects, loading, error /*, getProjectsByReferences */ };
};

export default useProjects;
