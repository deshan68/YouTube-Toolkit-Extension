import { Box, Typography } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import StorageIcon from "@mui/icons-material/Storage";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SubtitleStyles from "../SubtitleStyles";
import { slideIn } from "../../constants/constants";
import { useEffect, useState } from "react";

const SettingsScreen = ({
  setShowBackButton,
  showBackButton,
}: {
  setShowBackButton: (show: boolean) => void;
  showBackButton: boolean;
}) => {
  const [clickedItem, setClickedItem] = useState<number | null>(null);

  const settingsItems = [
    {
      id: 1,
      title: "Subtitle styles",
      icon: (
        <ColorLensIcon
          sx={{
            fontSize: "16px",
          }}
        />
      ),
      component: <SubtitleStyles />,
    },
    {
      id: 2,
      title: "Trash",
      icon: (
        <DeleteIcon
          sx={{
            fontSize: "16px",
          }}
        />
      ),
      component: <DeleteIcon />,
      additionalNote: "Upcoming feature",
    },
    {
      id: 3,
      title: "Storage",
      icon: (
        <StorageIcon
          sx={{
            fontSize: "16px",
          }}
        />
      ),
      component: <StorageIcon />,
      additionalNote: "Upcoming feature",
    },
    {
      id: 4,
      title: "About",
      icon: (
        <InfoIcon
          sx={{
            fontSize: "16px",
          }}
        />
      ),
      component: <StorageIcon />,
      additionalNote: "Upcoming feature",
    },
  ];

  const handleSettingItemClick = (id: number) => {
    if (id !== 1) return;
    setClickedItem(id);
    setShowBackButton(true);
  };

  useEffect(() => {
    !showBackButton && setClickedItem(null);
  }, [showBackButton]);

  if (clickedItem) {
    return (
      <Box
        sx={{
          animation: `${slideIn} 0.2s ease-in-out`,
        }}
      >
        {settingsItems[clickedItem - 1].component}
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
      {settingsItems.map((i) => (
        <>
          <Box
            sx={{
              display: "flex",
              color: "#fff",
              alignItems: "center",
              px: 2,
              py: 1,
              columnGap: 1.5,
              "&:hover": {
                cursor: "pointer",
                bgcolor: "#262626",
              },
            }}
            onClick={() => handleSettingItemClick(i.id)}
          >
            {i.icon}
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              {i.title}
            </Typography>
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: "400",
                  fontSize: "10px",
                  paddingLeft: 2,
                  paddingRight: 2,
                  borderRadius: "2px",
                  background:
                    "linear-gradient(90deg, rgba(131,58,180,1) 12%, rgba(253,29,29,1) 73%, rgba(255,167,43,1) 100%)",
                }}
              >
                {i.additionalNote}
              </span>
              <KeyboardArrowRightIcon
                sx={{
                  // ml: "auto",
                  fontSize: "16px",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              height: "0.1px",
              width: "90%",
              bgcolor: "#262626",
              alignSelf: "center",
            }}
          />
        </>
      ))}
    </Box>
  );
};

export default SettingsScreen;
