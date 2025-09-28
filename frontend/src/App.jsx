
import React from 'react';
import Routes from './Routes';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <>
  {/* Removed duplicate UserButton from header. The correct user icon is in the Header component. */}
      <Routes />
    </>
  );
}

export default App;
