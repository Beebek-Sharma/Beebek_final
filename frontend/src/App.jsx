
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './components/Sidebar';
import ClerkAuthListener from './components/ClerkAuthListener';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <BrowserRouter>
      <ClerkAuthListener />
      <Sidebar />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
