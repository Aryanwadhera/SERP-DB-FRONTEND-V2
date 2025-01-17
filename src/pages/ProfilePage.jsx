import React, { useEffect, useState } from 'react';
import { MdOutlineAccountCircle } from "react-icons/md";
import { useAuth0 } from '@auth0/auth0-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Define strippedSub to extract the user ID
        const strippedSub = user.sub.replace(/.*\|/, '');

        // Fetch all creators from Firestore
        const creatorsSnapshot = await getDocs(collection(db, 'creators'));
        const creatorsData = creatorsSnapshot.docs.map(doc => doc.data());

        // Find the logged-in user's profile
        const userCreator = creatorsData.find(creator => creator.auth0Id === strippedSub);
        setUserProfile(userCreator);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-blue-500 flex items-center">
        <MdOutlineAccountCircle className="mr-2" /> Your Profile
      </h1>
      <p className="text-base-content/70">
        Welcome to your profile page. This will being a work in progress as we add more features.
      </p>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Name</h2>
          <p>{userProfile.Name}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p>{userProfile.email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Bio</h2>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
