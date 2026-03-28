import { Link, Route, Routes } from "react-router-dom";
import Login from "../Login";
import SignUp from "../SignUp";
import Profile from "../Profile";
import VideoUpload from "../VideoUpload";
import Home from "../HomePage"
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,

} from "@mui/material";
import {
  AppbarActionIcons,
  AppbarContainer,
  AppbarHeader,
  MyList,
} from "../styles/appbar";
import PersonIcon from "@mui/icons-material/Person";
import Logint from "@mui/icons-material/Login";
import Upload from "@mui/icons-material/Upload";

export default function Navigation() {
  return (
    <>
      <AppbarContainer>
        
        <AppbarHeader variant="h4">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Sphinx</Link>
        </AppbarHeader>
    
    <MyList type="row">
    <Link title='Sign Out' to='/Profile'>
      <ListItemButton
          sx={{
            justifyContent: "center",
          }}
        >
            <PersonIcon />
      </ListItemButton>
    </Link>
    <Divider orientation="vertical" flexItem />
    <Link title='Sign Out' to='/login'>
      <ListItemButton
          sx={{
            justifyContent: "center",
          }}
        >
            <Logint />
      </ListItemButton>
    </Link>
    <Link title='Upload' to='/upload'>
      <ListItemButton
          sx={{
            justifyContent: "center",
          }}
        >
            <Upload />
      </ListItemButton>
    </Link>
    </MyList>
       
  </AppbarContainer>
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
