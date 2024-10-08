import { useEffect, useState } from "react";
import { Box } from "@mui/joy";
import {
  bannerTitles,
  FileSelectionAreaBoxStyle,
  HomePageBoxStyle,
} from "../constants/constants";
import {
  StyleSetting,
  Subtitle,
  SubtitleSyncRecordType,
  VideoDetails,
} from "../utils/types";
import { getStoredStyleSetting } from "../utils/utils";
import VideoCard from "./VideoCard";
import TimeShifter from "./TimeShifter";
import noSelectedVideoSvg from "../assets/selected-box.svg";
import GradientButton from "./buttton/GradientButton";
import FileSelectButton from "./buttton/FileSelectButton";
import RemoveButton from "./buttton/RemoveButton";
import SVGBanner from "./SVGBanner";
import {
  getStorage,
  removeStorage,
  sendMessageToContent,
} from "../../../shared/chrome-utils";
import { MessageTypes, UrlValidation } from "../../../shared/types";
import Instructions from "./Instructions";
import SavedSubtitlesStatus from "./SavedSubtitlesStatus";
import SkeltonLoader from "./SkeltonLoader";

function HomePage() {
  const [fileName, setFileName] = useState<string>("");
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [syncedSubtitles, setSyncedSubtitles] = useState<Subtitle[]>([]);
  const [currentUrlId, setCurrentUrlId] = useState<string>("");
  const [resyncTime, setResyncTime] = useState<number>(0);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [styleSetting, setStyleSetting] = useState<StyleSetting | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<UrlValidation | undefined>(
    undefined
  );

  useEffect(() => {
    checkCurrentURL();
  }, []);

  const getInitialData = async (): Promise<void> => {
    getVideoID();
    getSubtitlesStatus();
    getVideoDetails();

    setStyleSetting(await getStoredStyleSetting());
  };

  const checkCurrentURL = async () => {
    const response = await sendMessageToContent<{
      isOnYoutube: boolean;
      isVideoSelected: boolean;
    }>({
      type: MessageTypes.OPEN_POPUP,
    });
    setIsValidUrl(response);
    if (response?.isVideoSelected) {
      getInitialData();
    } else {
      setIsLoading(false);
    }
  };

  const loadSubtitleSyncRecordFromStorage = async (
    currentUrlId: string
  ): Promise<void> => {
    const storedSubtitles = await getStorage<SubtitleSyncRecordType>(
      currentUrlId
    );
    if (storedSubtitles) {
      setSyncedSubtitles(storedSubtitles.syncedSubtitles);
      setResyncTime(storedSubtitles.subtitleResyncTime);
      setFileName(storedSubtitles.fileName);
    }
  };

  const removeSubtitleFileFormLocalStorage = async (): Promise<void> => {
    await removeStorage(currentUrlId);

    setFileName("");
    setSyncedSubtitles([]);
    setResyncTime(0);
    removeSubtitleElements();
    setIsSubtitlesOn(false);
  };

  const getVideoID = async (): Promise<void> => {
    const response = await sendMessageToContent<{ videoId: string }>({
      type: MessageTypes.SEND_VIDEO_ID,
    });
    if (response) {
      loadSubtitleSyncRecordFromStorage(response.videoId);
      setCurrentUrlId(response.videoId);
    }
  };

  const getSubtitlesStatus = async (): Promise<void> => {
    const response = await sendMessageToContent<{ isSubtitlesOn: boolean }>({
      type: MessageTypes.SEARCH_INITIAL_SUBTITLES,
    });
    if (response) {
      setIsSubtitlesOn(response.isSubtitlesOn);
    }
  };

  const getVideoDetails = async (): Promise<void> => {
    const response = await sendMessageToContent<{ videoDetails: VideoDetails }>(
      {
        type: MessageTypes.SEND_VIDEO_DETAILS,
      }
    );
    if (response) {
      setVideoDetails(response.videoDetails);
      setIsLoading(false);
    }
  };

  const removeSubtitleElements = async (): Promise<void> => {
    await sendMessageToContent<{}>({
      type: MessageTypes.REMOVE_SUBTITLES_ELEMENT,
    });
  };

  const subtitleStart = async (updatedSubs?: Subtitle[]): Promise<void> => {
    const subtitles = updatedSubs || syncedSubtitles;
    const response = await sendMessageToContent<{ isSubtitleOn: boolean }>({
      type: MessageTypes.APPLY_SUBTITLES,
      body: { subtitles, styleSetting, currentUrlId },
    });

    if (response) {
      setIsSubtitlesOn(response.isSubtitleOn);
    }
  };

  if (isLoading) {
    return <SkeltonLoader />;
  }

  if (!isValidUrl?.isVideoSelected) {
    return (
      <SVGBanner
        svg={noSelectedVideoSvg}
        title={bannerTitles.NO_VIDEO_SELECTED}
      />
    );
  }

  return (
    <Box sx={HomePageBoxStyle}>
      {/* cover image */}
      {videoDetails && (
        <VideoCard
          videoDetails={videoDetails}
          currentUrlId={currentUrlId}
          isSubtitlesFoundFromLocal={syncedSubtitles.length > 0}
          subtitleStart={subtitleStart}
          isSubtitlesOn={isSubtitlesOn}
          setIsSubtitlesOn={setIsSubtitlesOn}
        />
      )}

      {/* file selection area */}
      <Box sx={FileSelectionAreaBoxStyle}>
        <FileSelectButton
          fileName={fileName}
          setFileName={setFileName}
          currentUrlId={currentUrlId}
          setSyncedSubtitles={setSyncedSubtitles}
        />
        <SavedSubtitlesStatus fileName={fileName} />
        {fileName && (
          <RemoveButton buttonClick={removeSubtitleFileFormLocalStorage} />
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
      <Instructions />

      {/* time shifter */}
      <TimeShifter
        currentUrlId={currentUrlId}
        resyncTime={resyncTime}
        setResyncTime={setResyncTime}
        setSyncedSubtitles={setSyncedSubtitles}
        subtitleStart={subtitleStart}
        syncedSubtitles={syncedSubtitles}
        isSubtitlesFound={syncedSubtitles.length > 0}
      />
    </Box>
  );
}

export default HomePage;
