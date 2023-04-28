import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile';
import VideoUpload from './VideoUpload';
import Navigation from './Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function PrivateRoute({ component: Component, ...rest }) {
  const [user] = useAuthState(auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <PrivateRoute path="/profile" element={<Profile />} />
        <PrivateRoute path="/upload" element={<VideoUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
