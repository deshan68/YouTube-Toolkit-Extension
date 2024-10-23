import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Toolbar,
} from "@mui/material";
import ExploreScreen from "./components/ExploreScreen";
import SettingsScreen from "./components/SettingsScreen";
import ExploreIcon from "@mui/icons-material/Explore";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import NavBar from "./components/NavBar";

const App = () => {
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("Explore");
  const [showBackButton, setShowBackButton] = useState(false);

  const [clickedPlayListItemId, setClickedPlayListItemId] = useState<
    number | null
  >(null);

  const contentComponents = [
    <ExploreScreen
      key="explore"
      showBackButton={showBackButton}
      clickedPlayListItemId={clickedPlayListItemId}
      setClickedPlayListItemId={setClickedPlayListItemId}
      setShowBackButton={setShowBackButton}
      setTitle={setTitle}
    />,
    <SettingsScreen
      key="settings"
      showBackButton={showBackButton}
      setShowBackButton={setShowBackButton}
    />,
  ];

  const handleNavigation = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setTitle(newValue === 0 ? "Explore" : "Settings");
    setShowBackButton(false);
  };

  const handleBack = () => {
    if (clickedPlayListItemId) {
      setClickedPlayListItemId(null);
      setTitle("Playlist Manager");
      return;
    }

    setShowBackButton(false);
    setTitle(value === 0 ? "Explore" : "Settings");
  };

  return (
    <Box>
      <CssBaseline />
      <NavBar
        title={title}
        showBackButton={showBackButton}
        handleBack={handleBack}
      />

      <Box
        component="main"
        sx={{
          width: "350px",
        }}
      >
        <Toolbar />
        <CssBaseline />
        <>
          <Box sx={{ pt: 2 }}>{contentComponents[value]}</Box>
          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
            elevation={3}
          >
            <BottomNavigation
              value={value}
              onChange={handleNavigation}
              showLabels
              sx={{
                bgcolor: "#262626",
                "& .Mui-selected": {
                  "& .MuiBottomNavigationAction-label": {
                    color: "#FFFF",
                    transition: "none",
                    fontSize: "10px",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#FFFF",
                  },
                },
              }}
            >
              <BottomNavigationAction
                label="Explore"
                icon={<ExploreIcon sx={{ fontSize: "18px" }} />}
                sx={{
                  color: "#989898",
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "10px",
                    color: "#989898",
                  },
                }}
              />
              <BottomNavigationAction
                label="Settings"
                icon={<SettingsIcon sx={{ fontSize: "18px" }} />}
                sx={{
                  color: "#989898",
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "10px",
                    color: "#989898",
                  },
                }}
              />
            </BottomNavigation>
          </Paper>
        </>
      </Box>
    </Box>
  );
};

export default App;
