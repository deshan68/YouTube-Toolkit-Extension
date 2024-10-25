import { Box, Container, Typography } from "@mui/joy";

const SVGBanner = ({ svg, title }: { svg: string, title: string }) => {
  return (
    <Container
      sx={{
        width: "100%",
        height: "475px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        px: 6,
      }}
    >
      <Box sx={{ width: "140px", height: "140px", overflow: "hidden", pb: 1 }}>
        <img
          src={svg}
          alt="My SVG"
          style={{ width: "100%", height: "100%", opacity: "0.6" }}
        />
      </Box>
      <Typography
        level="body-sm"
        sx={{ color: "#989898", textAlign: "center" }}
      >
        {title}
      </Typography>
    </Container>
  );
};

export default SVGBanner;
