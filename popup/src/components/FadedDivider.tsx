import { Box, styled } from "@mui/joy";

export const FadedDivider = styled(Box)(({}) => ({
  position: "relative",
  height: "1px",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(152,152,152,0.5) 50%, rgba(0,0,0,0) 100%)",
  },
}));
