import { Typography } from "@mui/joy";
import { AppBar, Toolbar } from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

const NavBar = () => {
  return (
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
          startDecorator={<SubtitlesIcon fontSize="medium" />}
        >
          Subtitle Syncer
        </Typography>
        <Typography
          level="body-xs"
          sx={{
            fontFamily: "sans-serif",
            color: "#989898",
            fontWeight: "200",
          }}
        >
          Youtube Subtitle Manager | V1.0.7
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
