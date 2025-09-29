
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-github-dark py-12 px-4 sm:px-6 lg:px-8">
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </div>
  );
};

export default Login;
