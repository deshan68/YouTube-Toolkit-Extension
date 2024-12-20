import { useState } from "react";
import { Box } from "@mui/joy";
import {
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import StyleIcon from "@mui/icons-material/Style";
import HomePage from "./HomePage";
// import SavedVideos from "./SavedVideos";
import StylesSetting from "./StylesSetting";

const BottomNavComponent = () => {
  const [value, setValue] = useState(0);

  const contentComponents = [
    <HomePage key="home" />,
    // <SavedVideos key="saved" />,
    <StylesSetting key="styles" />,
  ];

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <div>{contentComponents[value]}</div>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        elevation={3}
      >
        <BottomNavigation
          value={value}
          showLabels
          onChange={(_: any, newValue: any) => setValue(newValue)}
          sx={{
            bgcolor: "#111111",
            "& .Mui-selected": {
              "& .MuiBottomNavigationAction-label": {
                color: "#00D0FF",
                transition: "none",
                fontSize: "10px",
              },
              "& .MuiSvgIcon-root": {
                color: "#00D0FF",
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon sx={{ fontSize: "18px" }} />}
            sx={{
              color: "#FFFFFF",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "10px",
                color: "#FFFFFF",
              },
            }}
          />
          <BottomNavigationAction
            label="Saved"
            icon={<BookmarksIcon sx={{ fontSize: "18px" }} />}
            sx={{
              color: "#FFFFFF",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "10px",
                color: "#FFFFFF",
              },
            }}
          />
          <BottomNavigationAction
            label="Style"
            icon={<StyleIcon sx={{ fontSize: "18px" }} />}
            sx={{
              color: "#FFFFFF",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "10px",
                color: "#FFFFFF",
              },
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNavComponent;
