import DeleteIcon from "@mui/icons-material/Delete";
import { AspectRatio, Box, Card, CardContent } from "@mui/joy";
import { IconButton, Typography } from "@mui/material";
import { SavedItemDetails } from "../utils/types";
import { useEffect, useState } from "react";
import { truncateTitle } from "../utils/utils";
import { getStorage, setStorage } from "../../../shared/chrome-utils";

const SavedVideos = () => {
  const [savedList, setSavedList] = useState<SavedItemDetails[]>([]);

  const checkIsVideoSaved = async (): Promise<void> => {
    const savedList = await getStorage<SavedItemDetails[]>("savedList");
    if (savedList) setSavedList(savedList);
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
    const savedList = await getStorage<SavedItemDetails[]>("savedList");

    if (savedList) {
      const updatedList = savedList.filter(
        (video) => video.videoId !== videoId
      );

      await setStorage("savedList", JSON.stringify(updatedList));

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
        <Typography variant="caption" color="#989898">
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
        rowGap: 2,
        flexDirection: "column",
      }}
    >
      {savedList.map((item) => (
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
                  {truncateTitle(item.videoTitle || "", 100)}
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
