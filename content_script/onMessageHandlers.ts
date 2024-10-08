import { StyleSetting, Subtitle, VideoDetails } from "../popup/src/utils/types";
import { UrlValidation } from "../shared/types";
import { checkIsValidUrl } from "../shared/utils";

export const onOpenPopup = async (): Promise<UrlValidation> => {
  const url = window.location.href;
  const urlValidation = checkIsValidUrl(url);
  return urlValidation;
};

export const onSendVideoId = (): string => {
  const urlParams = new URL(window.location.href);
  const videoId = urlParams.searchParams.get("v");
  if (videoId) return videoId;
  return "";
};

export const onSearchInitialSubtitle = async (): Promise<boolean> => {
  const subTitleElement = document.querySelector(".sub-title-div");
  if (subTitleElement) return true;
  return false;
};

export const onSendVideoDetails = async (): Promise<VideoDetails> => {
  const url = window.location.href;
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${url}&format=json`
  );
  const data = await response.json();

  const videoDetails: VideoDetails = {
    title: data.title,
    thumbnailUrl: data.thumbnail_url,
    authorName: data.author_name,
    videoUrl: url,
  };
  return videoDetails;
};

export const onRemoveSubtitlesElement = async (): Promise<void> => {
  let timeUpdateListener: (() => void) | null = null;
  const youTubePlayer = document.querySelector("video");
  const subTitleElement = document.querySelector(".sub-title-div");

  if (subTitleElement) subTitleElement.remove();
  if (timeUpdateListener && youTubePlayer) {
    youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);
  }
};

export const onApplySubtitles = (
  subtitles: Subtitle[],
  styleSetting: StyleSetting,
  currentUrlId: string
): boolean => {
  let timeUpdateListener: (() => void) | null = null;

  const removeSubtitleElements = () => {
    const subTitleElement = document.querySelector(".sub-title-div");
    if (subTitleElement) subTitleElement.remove();
  };

  // Remove existing subtitle elements
  removeSubtitleElements();

  const previousSubTitleElement =
    document.getElementsByClassName("sub-title-div");
  if (previousSubTitleElement[0]) previousSubTitleElement[0].remove();

  const youTubePlayer = document.querySelector("video");
  const player = document.querySelector("#ytd-player");
  if (!youTubePlayer || !player || !subtitles) return false;

  const subTitleElement = document.createElement("div");
  subTitleElement.className = "sub-title-div";
  subTitleElement.style.color = styleSetting.fontColor;
  subTitleElement.style.fontSize = styleSetting.fontSize;
  subTitleElement.style.backgroundColor = `rgba(0, 0, 0, ${styleSetting.backgroundOpacity})`;
  subTitleElement.style.fontWeight = "bold";
  subTitleElement.style.position = "absolute";
  subTitleElement.style.bottom = "60px";
  subTitleElement.style.left = "50%";
  subTitleElement.style.transform = "translateX(-50%)";
  subTitleElement.style.zIndex = "1000";
  subTitleElement.style.display = "flex";
  subTitleElement.style.textAlign = "center";
  player.appendChild(subTitleElement);

  youTubePlayer.play();

  if (timeUpdateListener) {
    youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);
  }

  timeUpdateListener = () => {
    if (
      new URLSearchParams(window.location.search).get("v") !== currentUrlId &&
      timeUpdateListener
    ) {
      removeSubtitleElements();
      youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);

      return false;
    }
    const currentTime = youTubePlayer.currentTime;
    const currentSubtitle = subtitles.find(
      (subtitle) => currentTime >= subtitle.start && currentTime <= subtitle.end
    );
    subTitleElement.innerText = currentSubtitle ? currentSubtitle.text : "";
  };

  youTubePlayer.addEventListener("timeupdate", timeUpdateListener);
  return true;
};
