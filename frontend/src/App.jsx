
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './components/Sidebar';
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
      <Sidebar />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
