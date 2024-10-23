import { Box, Typography } from "@mui/material";
import { truncateTitle } from "../utils/utils";

const SavedSubtitlesStatus = ({ fileName }: { fileName: string }) => {
  return (
    <>
      {fileName ? (
        <Box>
          <Typography
            sx={{ color: "#fff", fontWeight: "sm", fontSize: "12px" }}
          >
            {truncateTitle(fileName, 20)}
          </Typography>
          <Typography
            sx={{ color: "#989898", fontWeight: "sm", fontSize: "12px" }}
          >
            Saved subtitle found
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{ color: "#fff", fontWeight: "sm", fontSize: "12px" }}
        >
          * No file chosen
        </Typography>
      )}
    </>
  );
};

export default SavedSubtitlesStatus;
