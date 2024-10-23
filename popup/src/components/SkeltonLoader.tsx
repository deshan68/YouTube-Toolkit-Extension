import { Box } from "@mui/joy";
import { Skeleton } from "@mui/material";

function SkeltonLoader() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Skeleton
        width={310}
        height={180}
        animation="wave"
        variant="rectangular"
        sx={{ bgcolor: "grey.900", mt: 1, borderRadius: "20px" }}
      />
      <Box
        sx={{
          width: "310px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 1,
          }}
        >
          <Skeleton
            width={170}
            height={10}
            animation="wave"
            variant="rectangular"
            sx={{ bgcolor: "grey.900", borderRadius: "5px" }}
          />
          <Skeleton
            width={120}
            height={10}
            animation="wave"
            variant="rectangular"
            sx={{ bgcolor: "grey.900", borderRadius: "5px" }}
          />
        </Box>
        <Skeleton
          width={90}
          height={40}
          animation="wave"
          variant="rectangular"
          sx={{ bgcolor: "grey.900", borderRadius: "20px" }}
        />
      </Box>
      <Box
        sx={{
          width: "310px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[310, 280, 300, 240, 300].map((w) => (
          <Skeleton
            width={w}
            height={10}
            animation="wave"
            variant="rectangular"
            sx={{ bgcolor: "grey.900", borderRadius: "5px", mb: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default SkeltonLoader;
