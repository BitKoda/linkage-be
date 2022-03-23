import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import CustomSwitch from "./CustomSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";
import AgeUk from "./AgeUk";

const account = ["Profile", "Visitees", "Logout"];

const Header = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const ourTheme = useContext(ThemeContext);

  return (
    <Container sx={{ paddingTop: "40px" }}>
      <AppBar
        position="static"
        sx={{
          zIndex: "tooltip",
          position: "fixed",
          left: 0,
          top: 0,
          right: 0,
          backgroundColor: ourTheme.ourTheme.palette.primary.main,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <AgeUk />
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <AgeUk />
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              AgeUk
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <CustomSwitch
                    sx={{ m: 1 }}
                    defaultChecked
                    onChange={() =>
                      props.setOurMode(
                        props.ourMode === "light" ? "dark" : "light"
                      )
                    }
                  />
                }
                label={props.ourMode + " mode"}
              />
            </FormGroup>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open account">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="/a-broken-link" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {account.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Container>
  );
};
export default Header;
