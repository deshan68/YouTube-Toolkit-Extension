import { Box, Typography } from "@mui/joy";
import { truncateTitle } from "../utils/utils";

const SavedSubtitlesStatus = ({ fileName }: { fileName: string }) => {
  return (
    <>
      {fileName ? (
        <Box>
          <Typography sx={{ color: "#00D0FF", fontWeight: "sm" }} fontSize="sm">
            {truncateTitle(fileName, 20)}
          </Typography>
          <Typography sx={{ color: "#989898", fontWeight: "sm" }} fontSize="xs">
            Saved subtitle found
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ color: "#00D0FF", fontWeight: "sm" }} fontSize="sm">
          * No file chosen
        </Typography>
      )}
    </>
  );
};

export default SavedSubtitlesStatus;
