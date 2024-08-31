import { StyleSetting } from "./types";

export const valueText = (value: number): string => {
  return `${value} sec`;
};

export const cleanText = (text: string): string => {
  return text
    .replace(/\r/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const timeToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":");
  const [secs, ms] = seconds.split(",");

  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(secs) +
    parseInt(ms) / 1000
  );
};

export const truncateTitle = (title: string, maxTitleLength: number) => {
  if (title.length <= maxTitleLength) {
    return title;
  }
  return `${title.substring(0, maxTitleLength)}...`;
};

export const checkUrl = (url: string): boolean => {
  if (!(url.includes("youtube.com/watch") && url.includes("v="))) {
    return false;
  }
  return true;
};

export const getStoredStyleSetting = (): StyleSetting => {
  const storedStyleSetting = localStorage.getItem("styleSetting");
  if (storedStyleSetting) {
    const _storedStyleSetting: StyleSetting = JSON.parse(storedStyleSetting);
    return _storedStyleSetting;
  }
  return {
    fontSize: "18px",
    fontColor: "#ffff",
    backgroundOpacity: "0.2",
  };
};

export const getFontSizeHandlerButton = (buttonColor: string) => ({
  width: "100px",
  height: "45px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: buttonColor,
  "&:hover": {
    bgcolor: "#333333",
  },
});
