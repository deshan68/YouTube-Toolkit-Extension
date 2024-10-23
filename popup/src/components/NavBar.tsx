import { AppBar, Toolbar, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const NavBar = ({
  title,
  showBackButton,
  handleBack,
}: {
  title: string;
  showBackButton: boolean;
  handleBack: () => void;
}) => {
  return (
    <AppBar component={"nav"}>
      <Toolbar
        sx={{
          bgcolor: "#262626",
          py: 2,
        }}
      >
        {showBackButton && (
          <ArrowBackIosIcon
            onClick={handleBack}
            sx={{
              color: "#ffff",
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: "600",
              fontSize: "16px",
            }}
          />
        )}
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "sans-serif",
            fontWeight: "600",
            color: "#ffff",
          }}
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
