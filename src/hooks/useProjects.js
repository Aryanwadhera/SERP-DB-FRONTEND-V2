import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, getDoc } from "firebase/firestore";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsAndCreatorsAndServices = async () => {
      try {
        // Fetch Projects and Services from Firestore in parallel
        const [projectsSnapshot, servicesSnapshot] = await Promise.all([
          getDocs(collection(db, 'Projects')),
          getDocs(collection(db, 'ProductsAndServices')),
        ]);

        const projectsData = projectsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            description: data.description || '' // Remove fallback to 'detailInfo'
          };
        });

        const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('Fetched Projects:', projectsData);
        console.log('Fetched Services:', servicesData);

        // Map services by projectId
        const servicesMap = new Map();
        servicesData.forEach(service => {
          let projectId = service.projectId;

          // If projectId is a DocumentReference, convert to string
          if (projectId && typeof projectId === 'object' && 'id' in projectId) {
            projectId = projectId.id;
          }

          if (!projectId) {
            console.warn(`Service ID ${service.id} is missing a projectId.`);
            return; // Skip services without a valid projectId
          }
          if (!servicesMap.has(projectId)) {
            servicesMap.set(projectId, []);
          }

          // Convert quantity to number if it's a string
          const quantity = typeof service.quantity === 'string' ? parseInt(service.quantity, 10) : service.quantity;

          // Validate required fields
          const { name, costperunit, reason, link } = service;
          if (!name || !costperunit || !reason || !link) {
            console.warn(`Service ID ${service.id} is missing one or more required fields.`);
            return; // Skip services with incomplete data
          }

          servicesMap.get(projectId).push({
            ...service,
            quantity, // Updated quantity
          });
        });

        console.log('Services Map:', servicesMap);

        // Fetch Creators for each project
        const finalProjects = await Promise.all(projectsData.map(async project => {
          // Change 'creator' to 'Creators' and handle references
          const creatorRefs = Array.isArray(project.creators) ? project.creators : [];

          console.log(`Project ID ${project.id} Creator References:`, creatorRefs);

          const projectCreators = await Promise.all(creatorRefs.map(async (creatorRef) => {
            const creatorDoc = await getDoc(creatorRef);
            if (creatorDoc.exists()) {
              return { id: creatorDoc.id, Name: creatorDoc.data().Name, ...creatorDoc.data() }; // Ensure 'Name' field is correctly mapped
            } else {
              console.warn(`Creator referenced in Project ID ${project.id} does not exist.`);
              return null;
            }
          }));

          const validCreators = projectCreators.filter(Boolean);

          console.log(`Project ID ${project.id} Creators:`, validCreators);

          const projectServices = servicesMap.get(project.id) || []; // Assign empty array if no services

          console.log(`Project ID ${project.id} Services:`, projectServices);

          return {
            ...project,
            creators: validCreators,
            services: projectServices,
          };
        }));

        console.log('Final Projects with Creators, Services, and Description:', finalProjects);

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

  return { projects, loading, error };
};

export default useProjects; // Ensure this is the last line in the file
