import { Link, Route, Routes } from "react-router-dom";
import Login from "../Login";
import SignUp from "../SignUp";
import Profile from "../Profile";
import VideoUpload from "../VideoUpload";
import Home from "../HomePage"

export default function Navigation() {
  return (
    <>
      <nav className="Navbar">
        <Link to="/" id='logo'>
            Sphinx
        </Link>
        <Link to="/profile">
          Profile
        </Link>
        <Link to="/upload">
          Upload Video
        </Link>
        <Link to="/login" >
          Login
        </Link>
        <Link to="/signup" >
          Sign Up
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/login" element={Login} />
        <Route path="/signup" element={SignUp} />
        <Route path="/profile" element={Profile} />
        <Route path="/upload" element={VideoUpload} />
      </Routes>
    </>
  );
}
