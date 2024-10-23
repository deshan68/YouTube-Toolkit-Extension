import { keyframes } from "@emotion/react";
import { DefaultFontsize, PlaylistItem, StyleSetting } from "../utils/types";

export const instructions: string[] = [
  "1 second = 1000 milliseconds",
  "If the subtitle appears too early, enter a positive number",
  "If the subtitle appears too late, enter a negative number",
];

export const colorsArray = [
  "#ffff",
  "#FF2B2B",
  "#50CC0C",
  "#FF289A",
  "#377DFF",
  "#DED302",
];

export enum bannerTitles {
  INVALID_URL = "It looks like you’re not on the YouTube video. Please navigate to YouTube to continue.",
  NO_VIDEO_SELECTED = "No video selected. Please select a video.",
}

export const HomePageBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

export const FileSelectionAreaBoxStyle = {
  width: "90%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  bgcolor: "#262626",
  borderRadius: "0 0 20px 20px",
  px: 2.5,
  py: 1.5,
};

export const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const InputFieldStyles = {
  border: "none",
  borderBottom: "1px solid #fff",
  backgroundColor: "#1E1E1E",
  outline: "none",
  caretColor: "#fff",
  color: "#fff",
  fontSize: "14px",
  padding: "2px",
  width: "200px",
};

export const defaultPlaylist: PlaylistItem[] = [
  {
    id: 1,
    folderName: "Watch Later",
    folderDescription: "",
    folderColor: "#C8A1E0",
    videoIdList: [],
  },
];

export const extractVideoIdFromUrl = (url: string): string => {
  const urlParams = new URL(url);
  const videoId = urlParams.searchParams.get("v");
  if (videoId) return videoId;
  return "";
};

export const defaultSubtitleStyle: StyleSetting = {
  fontSize: DefaultFontsize.Small,
  fontColor: "#ffff",
  backgroundOpacity: "0.2",
};
