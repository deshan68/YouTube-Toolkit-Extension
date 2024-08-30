import {
  Box,
  Card,
  CardContent,
  CardCover,
  IconButton,
  Typography,
} from "@mui/joy";
import { SavedItemDetails, VideoDetails } from "../utils/types";
import { truncateTitle } from "../utils/utils";
import defaultCover from "../assets/default.png";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useEffect, useState } from "react";

interface VideoDetailsProps {
  videoDetails: VideoDetails;
  currentUrlId: string;
  isSubtitlesFoundFromLocal: boolean;
  removeSubtitleElements: () => void;
  subtitleStart: () => void;
  isSubtitlesOn: boolean;
  setIsSubtitlesOn: (isSubtitlesOn: boolean) => void;
}

const VideoCard = ({
  videoDetails,
  currentUrlId,
  removeSubtitleElements,
  subtitleStart,
  isSubtitlesOn,
  isSubtitlesFoundFromLocal,
  setIsSubtitlesOn,
}: VideoDetailsProps) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const handleSubtitleShow = () => {
    isSubtitlesOn ? removeSubtitleElements() : subtitleStart();
    setIsSubtitlesOn(!isSubtitlesOn);
  };

  const handleVideoSave = async () => {
    const savedList = localStorage.getItem("savedList");

    if (!savedList) localStorage.setItem("savedList", JSON.stringify([]));

    if (savedList) {
      const _savedList: SavedItemDetails[] = JSON.parse(savedList);

      const currentVideo: SavedItemDetails = {
        videoId: currentUrlId,
        videoUrl: videoDetails.videoUrl,
        thumbnailUrl: videoDetails.thumbnailUrl,
        videoTitle: videoDetails.title,
        videoAuthorName: videoDetails.authorName,
      };
      const videoIndex = _savedList.findIndex(
        (video) => video.videoId === currentVideo.videoId
      );

      if (videoIndex !== -1) {
        _savedList.splice(videoIndex, 1);
      } else {
        _savedList.push(currentVideo);
      }

      localStorage.setItem("savedList", JSON.stringify(_savedList));
      checkIsVideoSaved();
    }
  };

  const checkIsVideoSaved = (): void => {
    const savedList = localStorage.getItem("savedList");
    if (savedList) {
      const _savedList: SavedItemDetails[] = JSON.parse(savedList);
      const videoExists = _savedList.some(
        (video) => video.videoId === currentUrlId
      );
      setIsSaved(videoExists);
    }
  };

  useEffect(() => {
    checkIsVideoSaved();
  }, []);

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton
              disabled={!isSubtitlesFoundFromLocal}
              onClick={handleSubtitleShow}
              size="sm"
              variant="solid"
              color="neutral"
              sx={{
                bgcolor: "rgba(0 0 0 / 0.4)",
                "&:hover, &:focus-within": {
                  bgcolor: "rgba(0 0 0 / 0.4)",
                },
                "&:disabled": {
                  bgcolor: "rgba(0 0 0 / 0.1)",
                },
              }}
            >
              {isSubtitlesOn ? (
                <ClosedCaptionIcon fontSize="medium" />
              ) : (
                <ClosedCaptionOffIcon fontSize="medium" />
              )}
            </IconButton>
            <IconButton
              onClick={handleVideoSave}
              size="sm"
              variant="solid"
              color="neutral"
              sx={{
                bgcolor: "rgba(0 0 0 / 0.4)",
                "&:hover, &:focus-within": {
                  bgcolor: "rgba(0 0 0 / 0.4)",
                },
                "&:disabled": {
                  bgcolor: "rgba(0 0 0 / 0.1)",
                },
                paddingTop: "2px",
              }}
            >
              {isSaved ? (
                <BookmarkIcon fontSize="medium" />
              ) : (
                <BookmarkBorderIcon fontSize="medium" />
              )}
            </IconButton>
          </Box>
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
