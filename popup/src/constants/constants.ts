export const instructions: string[] = [
  "1 second = 1000 milliseconds",
  "If the subtitle appears too early, enter a positive number",
  "If the subtitle appears too late, enter a negative number",
];

export const colors = [
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
  width: "100%",
  height: "100%",
  justifyContent: "space-between",
  pt: 4,
  rowGap: 1,
};
export const FileSelectionAreaBoxStyle = {
  width: "90%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
