import { Box, Card, CardContent, CardCover, IconButton } from "@mui/joy";
import { PlaylistItem, SavedItemDetails, VideoDetails } from "../utils/types";
import { truncateTitle } from "../utils/utils";
import defaultCover from "../assets/default.png";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useEffect, useState } from "react";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../shared/chrome-utils";
import { MessageTypes } from "../../../shared/types";
import { Tooltip, Typography } from "@mui/material";
import { defaultPlaylist } from "../constants/constants";

interface VideoDetailsProps {
  videoDetails: VideoDetails;
  currentUrlId: string;
  isSubtitlesFoundFromLocal: boolean;
  subtitleStart: () => void;
  isSubtitlesOn: boolean;
  setIsSubtitlesOn: (isSubtitlesOn: boolean) => void;
}

const VideoCard = ({
  videoDetails,
  currentUrlId,
  subtitleStart,
  isSubtitlesOn,
  isSubtitlesFoundFromLocal,
  setIsSubtitlesOn,
}: VideoDetailsProps) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const removeSubtitleElements = async (): Promise<void> => {
    await sendMessageToContent<{}>({
      type: MessageTypes.REMOVE_SUBTITLES_ELEMENT,
    });
  };

  const handleSubtitleShow = () => {
    isSubtitlesOn ? removeSubtitleElements() : subtitleStart();
    setIsSubtitlesOn(!isSubtitlesOn);
  };

  const handleVideoSave = async () => {
    let playList = await getStorage<PlaylistItem[]>("playlist");

    if (playList === undefined) playList = defaultPlaylist;

    const updatedPlayList = playList?.map((folder) => {
      if (folder.id === 1) {
        if (folder.videoIdList.includes(currentUrlId)) {
          folder.videoIdList = folder.videoIdList.filter(
            (videoId) => videoId !== currentUrlId
          );
        } else {
          folder.videoIdList.push(currentUrlId);
        }
      }
      return folder;
    });

    await setStorage("playlist", JSON.stringify(updatedPlayList));

    // video is already saved in the video list
    const isSavedOnVideoList = await checkIsVideoSavedOnVideoList();

    if (!isSavedOnVideoList) {
      const savedList = await getStorage<SavedItemDetails[]>("videoList");
      const updatedList = [
        ...(savedList || []),
        {
          videoId: currentUrlId,
          thumbnailUrl: videoDetails?.thumbnailUrl,
          videoUrl: videoDetails?.videoUrl,
          videoTitle: videoDetails?.title,
          videoAuthorName: videoDetails?.authorName,
        },
      ];
      await setStorage("videoList", JSON.stringify(updatedList));
    }

    await checkIsVideoSavedOnWatchLaterFolder();
  };

  const checkIsVideoSavedOnWatchLaterFolder = async (): Promise<void> => {
    const watchLaterList = await getStorage<PlaylistItem[]>("playlist").then(
      (playlist) => playlist?.find((folder) => folder.id === 1)?.videoIdList
    );
    watchLaterList?.includes(currentUrlId)
      ? setIsSaved(true)
      : setIsSaved(false);
  };

  const checkIsVideoSavedOnVideoList = async (): Promise<boolean> => {
    const isSaved = await getStorage<SavedItemDetails[]>("videoList").then(
      (list) => list?.some((video) => video.videoId === currentUrlId)
    );
    if (isSaved) return true;

    return false;
  };

  useEffect(() => {
    checkIsVideoSavedOnWatchLaterFolder();
    checkIsVideoSavedOnVideoList();
  }, []);

  return (
    <Card
      sx={{
        width: "315px",
        height: "160px",
        border: "none",
        padding: 0,
        borderRadius: "0px",
      }}
    >
      <CardCover>
        <img
          src={videoDetails.thumbnailUrl || defaultCover}
          loading="lazy"
          alt="cover image"
        />
      </CardCover>
      <CardCover
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
        }}
      />
      <CardContent sx={{ justifyContent: "space-between", m: 2 }}>
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
                borderRadius: "100%",
                "&:hover, &:focus-within": {
                  bgcolor: "rgba(0 0 0 / 0.4)",
                },
                "&:disabled": {
                  bgcolor: "rgba(0 0 0 / 0.1)",
                },
              }}
            >
              {isSubtitlesOn ? (
                <ClosedCaptionIcon
                  sx={{
                    fontSize: "18px",
                  }}
                />
              ) : (
                <ClosedCaptionOffIcon
                  sx={{
                    fontSize: "18px",
                  }}
                />
              )}
            </IconButton>
            <IconButton
              onClick={handleVideoSave}
              size="sm"
              variant="solid"
              color="neutral"
              sx={{
                bgcolor: "rgba(0 0 0 / 0.4)",
                borderRadius: "100%",
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
                <Tooltip title="Remove from Watch Later">
                  <BookmarkIcon
                    sx={{
                      fontSize: "18px",
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Save on Watch Later">
                  <BookmarkBorderIcon
                    sx={{
                      fontSize: "18px",
                    }}
                  />
                </Tooltip>
              )}
            </IconButton>
          </Box>
        </Box>
        <Box>
          <Typography
            color="#fff"
            sx={{
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {truncateTitle(videoDetails.title, 30)}
          </Typography>
          <Typography
            color="#989898"
            sx={{
              fontSize: "12px",
            }}
          >
            {truncateTitle(videoDetails.authorName, 30)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
