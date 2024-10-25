import DeleteIcon from "@mui/icons-material/Delete";
import { AspectRatio, Box, Card, CardContent } from "@mui/joy";
import { IconButton, Skeleton, Typography } from "@mui/material";
import { PlaylistItem, SavedItemDetails, VideoDetails } from "../utils/types";
import { useEffect, useState } from "react";
import { truncateTitle } from "../utils/utils";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../shared/chrome-utils";
import { MessageTypes, UrlValidation } from "../../../shared/types";
import { extractVideoIdFromUrl } from "../constants/constants";

interface SetPlaylistFunction<T> {
  (updateFunction: (prevPlayList: T) => T): void;
}

const SavedVideos = ({
  clickedPlayListItemId,
  playList,
  setPlayList,
}: {
  clickedPlayListItemId: number;
  playList: PlaylistItem[];
  setPlayList: SetPlaylistFunction<PlaylistItem[]>;
}) => {
  const [savedVideoList, setSavedVideoList] = useState<SavedItemDetails[]>([]);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidUrl, setIsValidUrl] = useState<UrlValidation | undefined>(
    undefined
  );

  const checkIsVideoSaved = async (): Promise<void> => {
    const videoIdList = playList.find(
      (i) => i.id === clickedPlayListItemId
    )?.videoIdList;

    if (videoIdList) {
      const savedList = await getStorage<SavedItemDetails[]>("videoList");
      if (savedList) {
        const savedVideos = savedList.filter((item) =>
          videoIdList.includes(item.videoId)
        );
        setSavedVideoList(savedVideos);
      }
    }
  };

  const clickVideo = async (videoUrl: string): Promise<void> => {
    try {
      let [tab] = await chrome.tabs.query({ active: true });
      chrome.scripting.executeScript<string[], void>({
        target: { tabId: tab.id! },
        args: [videoUrl],
        func: (videoUrl: string) => {
          window.location.href = videoUrl;
        },
      });
    } catch (error) {
      console.error("Error removing subtitle element:", error);
    }
  };

  const handleDeleteFromSaveList = async (videoId: string) => {
    const playList = await getStorage<PlaylistItem[]>("playlist");
    const updatedList = playList?.map((item) => {
      if (item.id === clickedPlayListItemId) {
        return {
          ...item,
          videoIdList: item.videoIdList.filter((id) => id !== videoId),
        };
      }
      return item;
    });
    setStorage("playlist", JSON.stringify(updatedList));
    setPlayList(() => updatedList || []);
  };

  const getVideoDetails = async (): Promise<void> => {
    const response = await sendMessageToContent<{ videoDetails: VideoDetails }>(
      {
        type: MessageTypes.SEND_VIDEO_DETAILS,
      }
    );
    if (response) {
      setVideoDetails(response.videoDetails);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const handleOnSaveVideo = async () => {
    let newPlaylist;
    const newVideoId = extractVideoIdFromUrl(videoDetails?.videoUrl || "");

    if ((await checkVideoAlreadySaved(newVideoId)) === false) {
      const savedList = await getStorage<SavedItemDetails[]>("videoList");
      const updatedList = [
        ...(savedList || []),
        {
          videoId: newVideoId,
          thumbnailUrl: videoDetails?.thumbnailUrl,
          videoUrl: videoDetails?.videoUrl,
          videoTitle: videoDetails?.title,
          videoAuthorName: videoDetails?.authorName,
        },
      ];

      await setStorage("videoList", JSON.stringify(updatedList));
    }

    setPlayList((prev) => {
      newPlaylist = prev.map((item) => {
        if (item.id === clickedPlayListItemId) {
          // Check if the videoId already exists in the videoIdList
          if (!item.videoIdList.includes(newVideoId)) {
            return {
              ...item,
              videoIdList: [...item.videoIdList, newVideoId],
            };
          }
        }
        return item;
      });
      return newPlaylist;
    });
    await setStorage("playlist", JSON.stringify(newPlaylist));
  };

  const checkVideoAlreadySaved = async (videoId: string): Promise<boolean> => {
    const savedList = await getStorage<SavedItemDetails[]>("videoList");
    if (savedList) {
      return savedList.some((item) => item.videoId === videoId);
    }
    return false;
  };

  const checkCurrentURL = async () => {
    try {
      const response = await sendMessageToContent<{
        isOnYoutube: boolean;
        isVideoSelected: boolean;
      }>({
        type: MessageTypes.OPEN_POPUP,
      });
      setIsValidUrl(response);
      if (response?.isVideoSelected) getVideoDetails();
    } catch (error) {
      setIsValidUrl({ isOnYoutube: false, isVideoSelected: false });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIsVideoSaved();
  }, [playList]);

  useEffect(() => {
    checkCurrentURL();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 1,
          overflowY: "auto",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              columnGap: 1,
            }}
          >
            <Skeleton
              key={i}
              width={100}
              height={70}
              animation="wave"
              variant="rectangular"
              sx={{ bgcolor: "grey.900", borderRadius: "10px" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 0.5,
                rowGap: 0.5,
              }}
            >
              <Skeleton
                key={i}
                width={210}
                height={8}
                animation="wave"
                variant="rectangular"
                sx={{ bgcolor: "grey.900", borderRadius: "10px" }}
              />
              <Skeleton
                key={i}
                width={130}
                height={8}
                animation="wave"
                variant="rectangular"
                sx={{ bgcolor: "grey.900", borderRadius: "10px" }}
              />
              <Skeleton
                key={i}
                width={160}
                height={8}
                animation="wave"
                variant="rectangular"
                sx={{ bgcolor: "grey.900", borderRadius: "10px" }}
              />
              <Skeleton
                key={i}
                width={140}
                height={8}
                animation="wave"
                variant="rectangular"
                sx={{ bgcolor: "grey.900", borderRadius: "10px" }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pb: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        rowGap: 2,
        flexDirection: "column",
        color: "#fff",
      }}
    >
      {videoDetails &&
        savedVideoList.some(
          (i) => i.videoId === extractVideoIdFromUrl(videoDetails.videoUrl)
        ) === false && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "95%",
              height: "45px",
              px: 2,
              bgcolor: "#262626",
              borderRadius: "12px",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#989898" }}>
              Do you want to save this video here?
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#000",
                cursor: "pointer",
                bgcolor: "#fff",
                borderRadius: "15px",
                height: "25px",
                width: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleOnSaveVideo}
            >
              Yes
            </Typography>
          </Box>
        )}

      {!isValidUrl?.isVideoSelected && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "95%",
            height: "45px",
            px: 2,
            bgcolor: "#262626",
            borderRadius: "12px",
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "#989898" }}>
            No videos found to add to this list.
          </Typography>
        </Box>
      )}

      {savedVideoList.length === 0 && (
        <Box
          sx={{
            pt: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontStyle: "italic",
          }}
        >
          <Typography variant="caption" color="#989898">
            No saved videos
          </Typography>
        </Box>
      )}

      {savedVideoList.map((item) => (
        <Card
          key={item.videoId}
          variant="outlined"
          orientation="horizontal"
          sx={{
            width: 330,
            bgcolor: "#111111",
            border: "none",
            zIndex: 1,
            p: 0,
            gap: 0.5,
          }}
        >
          <Box
            sx={{ display: "flex", cursor: "pointer", width: "100%" }}
            onClick={() => clickVideo(item.videoUrl || "")}
          >
            <AspectRatio sx={{ width: 110, mr: 1 }}>
              <img src={item.thumbnailUrl} loading="lazy" alt="" />
            </AspectRatio>

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="caption"
                  color="#fff"
                  sx={{ lineHeight: "110%" }}
                >
                  {truncateTitle(item.videoTitle || "", 75)}
                </Typography>
                <Typography variant="caption" color="#989898">
                  {truncateTitle(item.videoAuthorName || "", 35)}
                </Typography>
              </Box>
            </CardContent>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignSelf: "start",
            }}
          >
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteFromSaveList(item.videoId)}
              sx={{ p: 0 }}
            >
              <DeleteIcon color="error" sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SavedVideos;
