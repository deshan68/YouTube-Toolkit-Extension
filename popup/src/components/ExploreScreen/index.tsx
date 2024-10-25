import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Instructions from "../Instructions";
import HomePage from "../HomePage";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SubjectIcon from "@mui/icons-material/Subject";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import PlaylistManager from "../playlistManager";
import { slideIn } from "../../constants/constants";

function ExploreScreen({
  clickedPlayListItemId,
  setClickedPlayListItemId,
  setShowBackButton,
  showBackButton,
  setTitle,
}: {
  clickedPlayListItemId: number | null;
  setClickedPlayListItemId: (id: number | null) => void;
  setShowBackButton: (show: boolean) => void;
  setTitle: (title: string) => void;
  showBackButton: boolean;
}) {
  const [clickedItem, setClickedItem] = useState<number | null>(null);
  // const [dbKeys, setDbKeys] = useState<string[]>([]);

  const exploreItems = [
    {
      id: 1,
      title: "Subtitle Syncer",
      description:
        "Sync custom .srt subtitles with YouTube videos and adjust timing for perfect alignment",
      iconBgColor: "#87C1FF",
      icon: <SubtitlesIcon sx={{ fontSize: "40px", color: "#ffff" }} />,
      component: <HomePage />,
    },
    {
      id: 2,
      title: "Playlist Manager",
      description:
        "Create, manage, and organize custom YouTube playlists effortlessly",
      iconBgColor: "#A594F9",
      icon: <PlaylistAddCheckIcon sx={{ fontSize: "40px", color: "#ffff" }} />,
      component: (
        <PlaylistManager
          setTitle={setTitle}
          clickedPlayListItemId={clickedPlayListItemId}
          setClickedPlayListItemId={setClickedPlayListItemId}
        />
      ),
    },
    {
      id: 3,
      title: "Video Notes",
      description: "Take and save notes directly while watching YouTube videos",
      iconBgColor: "#86D293",
      icon: <TextSnippetIcon sx={{ fontSize: "40px", color: "#ffff" }} />,
      component: <Instructions />,
      additionalNote: "Upcoming feature",
    },
    {
      id: 4,
      title: "Transcript",
      description:
        "Generate and download video transcripts, with an option to summarize",
      iconBgColor: "#81DAE3",
      icon: <SubjectIcon sx={{ fontSize: "40px", color: "#ffff" }} />,
      component: "Item 4",
      additionalNote: "Upcoming feature",
    },
    {
      id: 5,
      title: "Usage Tracker",
      description:
        "Track your YouTube watch time and viewing habits with detailed insights",
      iconBgColor: "#C8A1E0",
      icon: <DataUsageIcon sx={{ fontSize: "40px", color: "#ffff" }} />,
      component: "Item 5",
      additionalNote: "Upcoming feature",
    },
  ];

  const handleExploreItemClick = (id: number, title: string) => {
    if (id === 1 || id === 2) {
      setClickedItem(id);
      setShowBackButton(true);
      setTitle(title);
    }
  };

  // const clearDB = async () => {
  //   await removeStorage([
  //     "subtitle",
  //     "86d6nQygRxQ",
  //     "WAjdP3Qwd1I",
  //     "playlist",
  //     "videoList",
  //     "subtitleStyle",
  //   ]);
  // };

  // const getStoreDbKeys = async () => {
  //   const keys = await getAllKeys();
  //   setDbKeys(keys);
  // };

  useEffect(() => {
    !showBackButton && setClickedItem(null);
  }, [showBackButton]);

  // useEffect(() => {
  //   getStoreDbKeys();
  // }, []);

  if (clickedItem) {
    return (
      <Box
        sx={{
          animation: `${slideIn} 0.2s ease-in-out`,
        }}
      >
        {exploreItems[clickedItem - 1].component}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {exploreItems.map((item) => (
        <Box
          sx={{
            display: "flex",
            cursor: "pointer",
            columnGap: 1,
            px: 2,
            py: 1,
            "&:hover": {
              cursor: "pointer",
              bgcolor: "#262626",
            },
          }}
          onClick={() => handleExploreItemClick(item.id, item.title)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "70px",
              height: "70px",
              borderRadius: "10%",
              bgcolor: item.iconBgColor,
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography variant="subtitle1" color="#ffff">
              {item.title}
              {item.additionalNote && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: "400",
                    fontSize: "12px",
                    marginLeft: 5,
                    paddingLeft: 2,
                    paddingRight: 2,
                    borderRadius: "2px",
                    background:
                      "linear-gradient(90deg, rgba(131,58,180,1) 12%, rgba(253,29,29,1) 73%, rgba(255,167,43,1) 100%)",
                  }}
                >
                  {item.additionalNote}
                </span>
              )}
            </Typography>
            <Typography
              color="#989898"
              sx={{ lineHeight: "110%", fontSize: "12px" }}
            >
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
      {/* {dbKeys.length > 0 && (
        <Box sx={{ display: "flex" }}>
          {dbKeys.map((key) => (
            <Typography color="#989898" sx={{ fontSize: "9px" }}>
              {key} |
            </Typography>
          ))}
        </Box>
      )}
      <Typography
        onClick={clearDB}
        sx={{ fontSize: "9px", cursor: "pointer", color: "#fff" }}
      >
        Clear DB
      </Typography> */}
    </Box>
  );
}

export default ExploreScreen;
