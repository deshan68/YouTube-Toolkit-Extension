import "./App.css";
import { Box, CssBaseline, Typography } from "@mui/joy";
import { AppBar, Toolbar } from "@mui/material";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Box sx={{ display: "flex", width: "100%", bgcolor: "#11111" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar
          sx={{
            bgcolor: "#111111",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Typography
            level="title-lg"
            sx={{ fontFamily: "sans-serif", fontWeight: "600", color: "#ffff" }}
            startDecorator={<ClosedCaptionIcon fontSize="medium" />}
          >
            Caption Craft
          </Typography>
          <Typography
            level="body-xs"
            sx={{
              fontFamily: "sans-serif",
              color: "#989898",
              fontWeight: "200",
            }}
          >
            Youtube Subtitle Manager | V1.0.1
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          bgcolor: "#111111",
          width: "350px",
        }}
      >
        <Toolbar />
        <HomePage />
      </Box>
    </Box>
  );
}

export default App;
