import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { AspectRatio, Box, Card, CardContent, Typography } from "@mui/joy";
import { IconButton } from "@mui/material";
import { SavedItemDetails } from "../utils/types";
import { useEffect, useState } from "react";
import { truncateTitle } from "../utils/utils";

const SavedVideos = () => {
  const [savedList, setSavedList] = useState<SavedItemDetails[]>([]);

  const checkIsVideoSaved = (): void => {
    const savedList = localStorage.getItem("savedList");
    if (savedList) {
      const _savedList: SavedItemDetails[] = JSON.parse(savedList);
      setSavedList(_savedList);
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

  const handleDeleteFromSaveList = (videoId: string) => {
    const savedList = localStorage.getItem("savedList");

    if (savedList) {
      const _savedList: SavedItemDetails[] = JSON.parse(savedList);
      const updatedList = _savedList.filter(
        (video) => video.videoId !== videoId
      );

      localStorage.setItem("savedList", JSON.stringify(updatedList));
      setSavedList(updatedList);
    }
  };

  useEffect(() => {
    checkIsVideoSaved();
  }, []);

  if (savedList.length === 0) {
    return (
      <Box
        sx={{
          pt: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontStyle: "italic",
        }}
      >
        <Typography level="body-sm" textColor="#989898">
          No saved videos
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pt: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        rowGap: 1,
        flexDirection: "column",
      }}
    >
      {savedList.map((item) => (
        <Card
          key={item.videoId}
          variant="outlined"
          orientation="horizontal"
          sx={{
            width: 320,
            bgcolor: "#111111",
            border: "1px solid #333",
            zIndex: 1,
          }}
        >
          <AspectRatio ratio="1" sx={{ width: 90 }}>
            <img src={item.thumbnailUrl} loading="lazy" alt="" />
          </AspectRatio>

          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              bgcolor: "#111111",
            }}
          >
            <Box>
              <Typography level="body-xs" textColor="#fff">
                {truncateTitle(item.videoTitle || "", 20)}
              </Typography>
              <Typography level="body-xs" textColor="#989898">
                {truncateTitle(item.videoAuthorName || "", 20)}
              </Typography>
              <Box
                onClick={() => clickVideo(item.videoUrl || "")}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: 0.5,
                  borderRadius: 3,
                  bgcolor: "#00D0FF",
                  py: 0.4,
                  px: 1,
                  width: "fit-content",
                }}
              >
                <PlayCircleIcon
                  fontSize="small"
                  sx={{
                    color: "#fff",
                  }}
                />
                <Typography level="body-xs" textColor="#fff">
                  Play
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteFromSaveList(item.videoId)}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SavedVideos;
