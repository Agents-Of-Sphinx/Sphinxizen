import { Link, Route, Routes } from "react-router-dom";
import Login from "../Login";
import SignUp from "../SignUp";
import Profile from "../Profile";
import VideoUpload from "../VideoUpload";

export default function Navigation() {
  return (
    <>
      <nav>
        <Link to="/">
            Sphinx
        </Link>
        <Link to="/login" >
          Login
        </Link>
        <Link to="/signup" >
          Sign Up
        </Link>
        <Link to="/profile">
          Profile
        </Link>
        <Link to="/videoUpload">
          Upload Video
        </Link>
      </nav>
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/profile" component={Profile} />
        <Route path="/videoUpload" component={VideoUpload} />
      </Routes>
    </>
  );
}
