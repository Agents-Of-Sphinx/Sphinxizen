import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
  } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { DrawerCloseButton } from "../../styles/appbar";
import { lighten } from "polished";
import { Colors } from "../../styles/theme";
import { setDrawerOpen } from "./drawerSlice";
import React from "react";
import { Link } from "react-router-dom";

const MiddleDivider = styled((props) => <Divider key={props.key} variant="middle" {...props} />)``;

export function AppDrawer() {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state) => state.ui.drawerOpen);

  const handleClose = () => {
    dispatch(setDrawerOpen(false));
  };

  return (
    <>
      {drawerOpen && (
        <DrawerCloseButton onClick={handleClose}>
          <CloseIcon sx={{ fontSize: "2.5rem", color: lighten(0.09, Colors.secondary) }} />
        </DrawerCloseButton>
      )}
      <Drawer open={drawerOpen}>
        <List>
          <ListItemButton>
            <ListItem style={{ textDecoration: 'none', color: 'inherit' }}>
                <Link  to="/home" style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'sans-serif' }}>Home</Link>
            </ListItem>
          </ListItemButton>
          <MiddleDivider />
          <ListItemButton>
          <ListItem style={{ textDecoration: 'none', color: 'inherit' }}>
        <Link  to="/products" style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'sans-serif' }}>Categories</Link>
        </ListItem>
          </ListItemButton>
          <MiddleDivider />
          <ListItemButton>
            <ListItem style={{ textDecoration: 'none', color: 'inherit' }}>
               <Link  to="/products" style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'sans-serif' }}>Products</Link>
            </ListItem>
          </ListItemButton>
          <MiddleDivider />
          {/* <ListItemButton>
              <ListItemText>About Us</ListItemText>
            </ListItemButton>
            <MiddleDivider />
            <ListItemButton>
              <ListItemText>Contact Us</ListItemText>
            </ListItemButton>
            <MiddleDivider /> */}
        </List>
      </Drawer>
    </>
  );
}