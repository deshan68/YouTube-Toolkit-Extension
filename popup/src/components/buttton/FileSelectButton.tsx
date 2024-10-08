import { Button } from "@mui/joy";
import { ChangeEvent } from "react";
import { cleanText, timeToSeconds } from "../../utils/utils";
import { Subtitle, SubtitleSyncRecordType } from "../../utils/types";
import { setStorage } from "../../../../shared/chrome-utils";

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
    const SubtitleSyncRecord: SubtitleSyncRecordType = {
      subtitleResyncTime: 0,
      syncedSubtitles: subtitleArray,
      fileName,
      isVideoSave: false,
    };
    await setStorage(currentUrlId, JSON.stringify(SubtitleSyncRecord));
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
    </>
  );
};

export default FileSelectButton;
