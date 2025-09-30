import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const ClerkAuthListener = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      console.log('User authenticated:', user);
    }
  }, [isLoaded, user]);

  return null;
};

export default ClerkAuthListener;