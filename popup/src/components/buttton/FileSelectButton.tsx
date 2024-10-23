import { Button } from "@mui/joy";
import { ChangeEvent } from "react";
import { cleanText, timeToSeconds } from "../../utils/utils";
import { Subtitle, SubtitleSyncRecordType } from "../../utils/types";
import { getStorage, setStorage } from "../../../../shared/chrome-utils";

type FileSelectButtonType = {
  fileName: string;
  setFileName: (fileName: string) => void;
  currentUrlId: string;
  setSyncedSubtitles: (subtitles: Subtitle[]) => void;
};

const FileSelectButton = ({
  fileName,
  setFileName,
  currentUrlId,
  setSyncedSubtitles,
}: FileSelectButtonType) => {
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

  const convertSrtToArray = async (
    srtContent: string,
    fileName: string
  ): Promise<void> => {
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
    const subtitleSyncRecord: SubtitleSyncRecordType = {
      id: currentUrlId,
      subtitleResyncTime: 0,
      syncedSubtitles: subtitleArray,
      fileName,
      isVideoSave: false,
    };

    const _allStoredSubtitles = await getStorage<SubtitleSyncRecordType[]>(
      "subtitle"
    );

    // const updatedSubtitleList = _allStoredSubtitles?.map((i) => {
    //   if (i.id === currentUrlId) {
    //     return {
    //       ..._allStoredSubtitles.find((i) => i.id === currentUrlId),
    //       syncedSubtitles: updatedSubs,
    //       subtitleResyncTime: newValue / 1000,
    //     };
    //   }
    //   return i;
    // });

    await setStorage(
      "subtitle",
      JSON.stringify([...(_allStoredSubtitles || []), subtitleSyncRecord])
    );
    setSyncedSubtitles(subtitleArray);
  };
  return (
    <>
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
              border: "1px solid #fff",
              borderRadius: "20px",
              color: "white",
              fontWeight: "600",
              fontSize: "12px",
              "&:hover": {
                bgcolor: "#fff",
                color: "#000",
              },
            }}
          >
            Choose File
          </Button>
        </label>
      )}
    </>
  );
};

export default FileSelectButton;
