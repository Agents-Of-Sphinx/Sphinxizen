import { BrowserRouter as Router, Route, Routes, redirect } from 'react-router-dom';

import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile';
import VideoUpload from './VideoUpload';
import Navigation from './Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Home from './HomePage';

function PrivateRoute({ component: Component, ...rest }) {
  const [user] = useAuthState(auth);
  if (user){
    return true
  }else{
    return false
  }
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {PrivateRoute}?<Route path="/profile" element={<Profile />} />: <Route path="/" element={<Login />} />
        {PrivateRoute}?<Route path="/upload" element={<VideoUpload />} />: <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
