
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-github-dark py-12 px-4 sm:px-6 lg:px-8">
      <SignUp routing="path" path="/register" signInUrl="/login" />
    </div>
  );
};

export default Register;
