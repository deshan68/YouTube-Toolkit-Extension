import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Input, Typography } from "@mui/joy";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Subtitle, SubtitleSyncRecordType } from "../utils/types";
import { getStorage, setStorage } from "../../../shared/chrome-utils";

interface TimeShifterProps {
  currentUrlId: string;
  resyncTime: number;
  setResyncTime: (time: number) => void;
  setSyncedSubtitles: (subtitles: Subtitle[]) => void;
  subtitleStart: (subtitles: Subtitle[]) => void;
  syncedSubtitles: Subtitle[];
  isSubtitlesFound: boolean;
}
const TimeShifter = ({
  currentUrlId,
  resyncTime,
  setResyncTime,
  setSyncedSubtitles,
  subtitleStart,
  syncedSubtitles,
  isSubtitlesFound,
}: TimeShifterProps) => {
  const [asyncVal, setAsyncVal] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const numberRegex = /^-?\d*\.?\d+$/;
    if (numberRegex.test(newValue)) {
      setAsyncVal(Number(newValue));
    }
  };

  const incrementTime = () => {
    setAsyncVal((prev) => prev + 100);
  };

  const decrementTime = () => {
    setAsyncVal((prev) => prev - 100);
  };

  const handleSync = () => {
    handleResyncSubtitles(asyncVal);
  };

  const handleResyncSubtitles = async (newValue: number): Promise<void> => {
    const _resyncTime = newValue / 1000 - resyncTime;
    setResyncTime(newValue / 1000);
    const updatedSubs = syncedSubtitles.map((sub) => {
      return {
        ...sub,
        start: sub.start + _resyncTime,
        end: sub.end + _resyncTime,
      };
    });
    setSyncedSubtitles(updatedSubs);

    const _allStoredSubtitles = await getStorage<SubtitleSyncRecordType[]>(
      "subtitle"
    );

    const updatedSubtitleList = _allStoredSubtitles?.map((i) => {
      if (i.id === currentUrlId) {
        return {
          ..._allStoredSubtitles.find((i) => i.id === currentUrlId),
          syncedSubtitles: updatedSubs,
          subtitleResyncTime: newValue / 1000,
        };
      }
      return i;
    });

    if (_allStoredSubtitles) {
      await setStorage("subtitle", JSON.stringify(updatedSubtitleList));
    } else {
      await setStorage("subtitle", JSON.stringify([]));
    }
    subtitleStart(updatedSubs);
  };

  useEffect(() => {
    setAsyncVal(resyncTime * 1000);
  }, [resyncTime]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "90%",
        height: "auto",
        bgcolor: "#262626",
        borderRadius: "20px",
        px: 1,
        py: 1.5,
      }}
    >
      {/* input */}
      <Input
        disabled={!isSubtitlesFound}
        value={asyncVal}
        onChange={handleInputChange}
        variant="plain"
        sx={{
          backgroundColor: "transparent",
          width: "130px",
          height: "55px",
          border: "1px solid #fff",
          borderRadius: "12px",
          fontSize: "md",
          "--Input-focusedThickness": "0px",
          "& input": {
            textAlign: "right",
            paddingRight: "5px",
            color: "white",
          },
          "&:focus-within": {
            outline: "none",
            border: "1px solid #fff",
          },
        }}
        endDecorator={
          <Typography
            sx={{
              color: "#fff",
              fontWeight: "sm",
              position: "absolute",
              right: "5px",
              fontSize: "xs",
              pt: "5px",
            }}
          >
            ms
          </Typography>
        }
      />
      {/* up and down */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "2px",
        }}
      >
        <IconButton
          disabled={!isSubtitlesFound}
          size="sm"
          sx={{
            color: "#fff",
            border: "1px solid #fff",
            width: "10px",
            height: "10px",
            borderRadius: "100%",
            "&:hover": {
              bgcolor: "#fff",
              color: "#000",
            },
          }}
          onClick={decrementTime}
        >
          <KeyboardArrowUpIcon
            sx={{
              fontSize: "14px",
            }}
          />
        </IconButton>
        <IconButton
          disabled={!isSubtitlesFound}
          size="sm"
          sx={{
            color: "#fff",
            border: "1px solid #fff",
            width: "10px",
            height: "10px",
            borderRadius: "100%",
            "&:hover": {
              bgcolor: "#fff",
              color: "#000",
            },
          }}
          onClick={incrementTime}
        >
          <ExpandMoreIcon
            sx={{
              fontSize: "14px",
            }}
          />
        </IconButton>
      </Box>

      {/* sync play button */}
      <Button
        variant="outlined"
        onClick={handleSync}
        disabled={!isSubtitlesFound}
        sx={{
          width: "96px",
          height: "55px",
          border: "none",
          borderRadius: "25px",
          color: "#000",
          background: "#ffff",
          fontSize: "12px",
          "&:hover": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        Sync/Play
      </Button>
    </Box>
  );
};

export default TimeShifter;
