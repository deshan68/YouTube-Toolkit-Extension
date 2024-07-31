import {
  Box,
  Container,
  LinearProgress,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import Button from "@mui/joy/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { cleanText, timeToSeconds, truncateTitle } from "../utils/utils";
import { instructions } from "../constants/constants";
import { VideoDetails } from "../utils/types";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import VideoCard from "./VideoCard";
import TimeShifter from "./TimeShifter";
import svg from "../assets/dreamer.svg";
import GradientButton from "./buttton/GradientButton";
import { FadedDivider } from "./FadedDivider";

interface Subtitle {
  start: number;
  end: number;
  text: string;
}
interface SubtitleSyncRecordType {
  subtitleResyncTime: number;
  syncedSubtitles: Subtitle[];
  fileName: string;
}

function HomePage() {
  const [fileName, setFileName] = useState<string>("");
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [syncedSubtitles, setSyncedSubtitles] = useState<Subtitle[]>([]);
  const [currentUrlId, setCurrentUrlId] = useState<string>("");
  const [resyncTime, setResyncTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const subtitleStart = async (updatedSubs?: Subtitle[]) => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [currentUrlId, JSON.stringify(updatedSubs || syncedSubtitles)],
      func: (currentUrlId, serializedSubtitles: string) => {
        let timeUpdateListener: (() => void) | null = null;
        const subtitles: Subtitle[] = JSON.parse(serializedSubtitles);

        const removeSubtitleElements = () => {
          const subTitleElement = document.querySelector(".sub-title-div");
          const testDiv = document.querySelector(".test-div");
          if (subTitleElement) subTitleElement.remove();
          if (testDiv) testDiv.remove();
        };

        // Remove existing subtitle elements
        removeSubtitleElements();

        const previousSubTitleElement =
          document.getElementsByClassName("sub-title-div");
        if (previousSubTitleElement[0]) previousSubTitleElement[0].remove();

        const youTubePlayer = document.querySelector("video");
        const player = document.querySelector("#ytd-player");
        if (!youTubePlayer || !player || !subtitles) return;

        const subTitleElement = document.createElement("div");
        subTitleElement.className = "sub-title-div";
        subTitleElement.style.color = "white";
        subTitleElement.style.fontSize = "30px";
        subTitleElement.style.fontWeight = "bold";
        subTitleElement.style.position = "absolute";
        subTitleElement.style.bottom = "60px";
        subTitleElement.style.left = "50%";
        subTitleElement.style.transform = "translateX(-50%)";
        subTitleElement.style.zIndex = "1000";
        player.appendChild(subTitleElement);

        youTubePlayer.play();

        if (timeUpdateListener) {
          youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);
        }

        timeUpdateListener = () => {
          if (
            new URLSearchParams(window.location.search).get("v") !==
              currentUrlId &&
            timeUpdateListener
          ) {
            removeSubtitleElements();
            youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);
            return;
          }
          const currentTime = youTubePlayer.currentTime;
          const currentSubtitle = subtitles.find(
            (subtitle) =>
              currentTime >= subtitle.start && currentTime <= subtitle.end
          );
          subTitleElement.innerText = currentSubtitle
            ? currentSubtitle.text
            : "";
        };

        youTubePlayer.addEventListener("timeupdate", timeUpdateListener);
      },
    });
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message.videoId !== undefined) {
      loadSubtitleSyncRecordFromStorage(message.videoId);
      setCurrentUrlId(message.videoId);
    }
    if (message.error !== undefined) {
      setIsError(true);
    }
  });

  const convertSrtToArray = (srtContent: string, fileName: string): void => {
    const srtLines = srtContent.split("\r\n\r\n");
    const subtitleArray: Subtitle[] = [];

    srtLines.forEach((block) => {
      const lines = block.split("\r\n");
      if (lines.length >= 3) {
        const timingLine = lines.find((line) => line.includes(" --> "));
        if (timingLine) {
          const [startTime, endTime] = timingLine.split(" --> ");
          const textLines = lines.slice(lines.indexOf(timingLine) + 1);

          subtitleArray.push({
            start: timeToSeconds(startTime),
            end: timeToSeconds(endTime),
            text: cleanText(textLines.join(" ")),
          });
        }
      }
    });
    const SubtitleSyncRecord: SubtitleSyncRecordType = {
      subtitleResyncTime: 0,
      syncedSubtitles: subtitleArray,
      fileName,
    };
    localStorage.setItem(currentUrlId, JSON.stringify(SubtitleSyncRecord));
    setSyncedSubtitles(subtitleArray);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        convertSrtToArray(content, file.name);
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    checkYoutubeUrl();
  }, []);

  const checkYoutubeUrl = async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true });
      await Promise.all([
        new Promise<VideoDetails>(() => {
          chrome.scripting.executeScript<string[], void>({
            target: { tabId: tab.id! },
            args: [tab.url!],
            func: (url = tab.url!) => {
              function checkYouTubePage(url: string): boolean {
                return (
                  (url?.includes("youtube.com/watch") && url.includes("v=")) ||
                  false
                );
              }
              const videoId = new URLSearchParams(window.location.search).get(
                "v"
              );
              if (!checkYouTubePage(url) || !videoId) {
                chrome.runtime.sendMessage({
                  error: "No active tab found or invalid URL",
                });
              } else {
                chrome.runtime.sendMessage({ videoId });
              }
            },
          });
        }),
        fetchVideoDetails(tab.url!),
      ]);
    } catch (error) {
      Error("No active tab found or invalid URL");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideoDetails = async (url: string): Promise<void> => {
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) {
      throw new Error("No video ID found in URL");
    }

    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    const data = await response.json();
    if (data.title && data.thumbnail_url) {
      const videoInfo: VideoDetails = {
        title: data.title,
        thumbnailUrl: data.thumbnail_url,
        authorName: data.author_name,
      };
      setVideoDetails(videoInfo);
      setIsLoading(false);
    } else {
      throw new Error("No video details found");
    }
  };

  const loadSubtitleSyncRecordFromStorage = (currentUrlId: string): void => {
    const storedSubtitles = localStorage.getItem(currentUrlId);

    if (storedSubtitles) {
      const SubtitleSyncRecord: SubtitleSyncRecordType =
        JSON.parse(storedSubtitles);
      setSyncedSubtitles(SubtitleSyncRecord.syncedSubtitles);
      setResyncTime(SubtitleSyncRecord.subtitleResyncTime);
      setFileName(SubtitleSyncRecord.fileName);
    }
  };

  const removeSubtitleFileFormLocalStorage = () => {
    localStorage.removeItem(currentUrlId);
    setFileName("");
    setSyncedSubtitles([]);
    setResyncTime(0);
    removeSubtitleElements();
  };

  const removeSubtitleElements = async () => {
    let [tab] = await chrome.tabs.query({ active: true });

    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: () => {
        let timeUpdateListener: (() => void) | null = null;
        const youTubePlayer = document.querySelector("video");

        const removeSubtitleElements = () => {
          const subTitleElement = document.querySelector(".sub-title-div");
          if (subTitleElement) subTitleElement.remove();
        };

        // Remove existing subtitle elements
        removeSubtitleElements();

        if (timeUpdateListener && youTubePlayer) {
          youTubePlayer.removeEventListener("timeupdate", timeUpdateListener);
        }
      },
    });
  };

  const handleResyncSubtitles = (newValue: number) => {
    let tempResyncTime = 0;

    setResyncTime((prev) => {
      tempResyncTime = prev;
      return prev;
    });
    const _resyncTime = newValue / 1000 - tempResyncTime;
    setResyncTime(newValue / 1000);
    const updatedSubs = syncedSubtitles.map((sub) => {
      return {
        ...sub,
        start: sub.start + _resyncTime,
        end: sub.end + _resyncTime,
      };
    });
    setSyncedSubtitles(updatedSubs);

    const storedSubtitles = localStorage.getItem(currentUrlId);
    if (storedSubtitles) {
      const SubtitleSyncRecord: SubtitleSyncRecordType =
        JSON.parse(storedSubtitles);
      localStorage.setItem(
        currentUrlId,
        JSON.stringify({
          ...SubtitleSyncRecord,
          syncedSubtitles: updatedSubs,
          subtitleResyncTime: newValue / 1000,
        })
      );
    }
    subtitleStart(updatedSubs);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "525px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
        }}
      >
        <LinearProgress
          sx={{
            color: "rgba(0,151,185,1) ",
          }}
          variant="soft"
        />
      </Box>
    );
  }
  if (isError) {
    return (
      <Container
        sx={{
          width: "100%",
          height: "525px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: 6,
        }}
      >
        <Box
          sx={{ width: "140px", height: "140px", overflow: "hidden", pb: 2 }}
        >
          <img
            src={svg}
            alt="My SVG"
            style={{ width: "100%", height: "100%", opacity: "0.5" }}
          />
        </Box>
        <Typography
          level="body-sm"
          sx={{ color: "#989898", textAlign: "center" }}
        >
          <span
            style={{
              fontSize: "1.5rem",
            }}
          >
            Oops!
          </span>
          <br /> It looks like you’re not on the YouTube video. Please navigate
          to YouTube to continue.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        pt: 4,
        rowGap: 1,
      }}
    >
      {/* cover image */}
      {videoDetails && (
        <VideoCard
          videoDetails={videoDetails}
          isSubtitlesFoundFromLocal={syncedSubtitles.length > 0}
        />
      )}

      {/* file selection area */}
      <Box
        sx={{
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          accept=".srt"
          style={{ display: "none" }}
          id="srt-file-input"
          onChange={handleFileUpload}
        />
        {!fileName && (
          <label htmlFor="srt-file-input">
            <Button
              component="span"
              size="md"
              variant="outlined"
              sx={{
                border: "1px solid white",
                borderRadius: "20px",
                color: "white",
                fontWeight: "md",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Choose File
            </Button>
          </label>
        )}
        {fileName ? (
          <Box>
            <Typography
              sx={{ color: "#00D0FF", fontWeight: "sm" }}
              fontSize="sm"
            >
              {truncateTitle(fileName, 20)}
            </Typography>
            <Typography
              sx={{ color: "#989898", fontWeight: "sm" }}
              fontSize="xs"
            >
              Saved subtitle found
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ color: "#00D0FF", fontWeight: "sm" }} fontSize="sm">
            * No file chosen
          </Typography>
        )}

        {fileName && (
          <Button
            size="md"
            variant="outlined"
            sx={{
              border: "1px solid white",
              borderRadius: "20px",
              color: "white",
              fontWeight: "md",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            startDecorator={<DeleteIcon fontSize="small" />}
            onClick={removeSubtitleFileFormLocalStorage}
          >
            Remove
          </Button>
        )}
      </Box>

      {/* play button*/}
      <GradientButton
        variant="solid"
        onClick={() => subtitleStart()}
        disabled={syncedSubtitles.length === 0}
        fileName={fileName}
      >
        Play on YouTube
      </GradientButton>

      {/* instructions */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
        <FadedDivider />
        <List aria-labelledby="decorated-list-demo" sx={{ p: 0, pt: 1 }}>
          {instructions.map((i, index) => (
            <ListItem key={index}>
              <DoneIcon
                fontSize="inherit"
                sx={{ color: "#989898", fontWeight: "sm" }}
              />
              <Typography
                sx={{ color: "#989898", fontWeight: "sm" }}
                fontSize="sm"
              >
                {i}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* time shifter */}
      <TimeShifter
        handleResyncSubtitles={handleResyncSubtitles}
        resyncTime={resyncTime}
        isSubtitlesFound={syncedSubtitles.length > 0}
      />
    </Box>
  );
}

export default HomePage;
