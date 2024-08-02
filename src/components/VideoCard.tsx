import {
  Box,
  Card,
  CardContent,
  CardCover,
  IconButton,
  Typography,
} from "@mui/joy";
import { SubtitleSyncRecordType, VideoDetails } from "../utils/types";
import { truncateTitle } from "../utils/utils";
import defaultCover from "../assets/default.png";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";

interface VideoDetailsProps {
  videoDetails: VideoDetails;
  isSubtitlesFoundFromLocal: boolean;
  removeSubtitleElements: () => void;
  subtitleStart: () => void;
  isSubtitlesOn: boolean;
  setIsSubtitlesOn: (isSubtitlesOn: boolean) => void;
  currentUrlId: string;
}

const VideoCard = ({
  videoDetails,
  removeSubtitleElements,
  subtitleStart,
  isSubtitlesOn,
  setIsSubtitlesOn,
  currentUrlId,
}: VideoDetailsProps) => {
  const handleSubtitleShow = () => {
    isSubtitlesOn ? removeSubtitleElements() : subtitleStart();

    const storedSubtitles = localStorage.getItem(currentUrlId);
    if (storedSubtitles) {
      const SubtitleSyncRecord: SubtitleSyncRecordType =
        JSON.parse(storedSubtitles);
      localStorage.setItem(
        currentUrlId,
        JSON.stringify({
          ...SubtitleSyncRecord,
          isSubtitlesOn: !isSubtitlesOn,
        })
      );
    }
    setIsSubtitlesOn(!isSubtitlesOn);
  };

  return (
    <Card
      sx={{
        width: "310px",
        height: "180px",
        border: "none",
        borderRadius: "20px",
        padding: 0,
      }}
    >
      <CardCover>
        <img
          src={videoDetails.thumbnailUrl || defaultCover}
          loading="lazy"
          alt=""
        />
      </CardCover>
      <CardCover
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
        }}
      ></CardCover>
      <CardContent
        sx={{ justifyContent: "space-between", height: "100%", m: 2 }}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton
            onClick={handleSubtitleShow}
            size="sm"
            variant="solid"
            color="neutral"
            sx={{
              bgcolor: "rgba(0 0 0 / 0.4)",
              "&:hover, &:focus-within": {
                bgcolor: "rgba(0 0 0 / 0.4)",
              },
            }}
          >
            {isSubtitlesOn ? (
              <ClosedCaptionIcon fontSize="medium" />
            ) : (
              <ClosedCaptionOffIcon fontSize="medium" />
            )}
          </IconButton>
        </Box>
        <Box>
          <Typography level="title-lg" textColor="#fff">
            {truncateTitle(videoDetails.title, 20)}
          </Typography>
          <Typography level="body-xs" textColor="#989898">
            {truncateTitle(videoDetails.authorName, 20)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
