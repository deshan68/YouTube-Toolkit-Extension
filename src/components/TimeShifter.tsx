import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Input, Typography } from "@mui/joy";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SyncIcon from "@mui/icons-material/Sync";

interface TimeShifterProps {
  handleResyncSubtitles: (time: number) => void;
  resyncTime: number;
  isSubtitlesFound: boolean;
}
const TimeShifter = ({
  handleResyncSubtitles,
  resyncTime,
  isSubtitlesFound,
}: TimeShifterProps) => {
  const [asyncVal, setAsyncVal] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
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

  useEffect(() => {
    setAsyncVal(resyncTime * 1000);
  }, [resyncTime]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: "auto",
        py: 4,
        background:
          "linear-gradient(180deg, rgba(217,217,217,0.1) 10%, rgba(115,115,155,0) 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.5,
        }}
      >
        <IconButton
          disabled={!isSubtitlesFound}
          size="sm"
          sx={{
            color: "#989898",
            "&:hover": {
              bgcolor: "black",
              color: "#989898",
            },
          }}
          onClick={decrementTime}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Input
          disabled={!isSubtitlesFound}
          value={asyncVal}
          onChange={handleInputChange}
          variant="plain"
          sx={{
            backgroundColor: "transparent",
            width: "96px",
            height: "40px",
            border: "1px solid #989898",
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
              border: "1px solid #989898",
            },
          }}
          endDecorator={
            <Typography
              sx={{
                color: "#00D0FF",
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
        <IconButton
          disabled={!isSubtitlesFound}
          size="sm"
          sx={{
            color: "#989898",
            "&:hover": {
              bgcolor: "black",
              color: "#989898",
            },
          }}
          onClick={incrementTime}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Button
        size="md"
        variant="outlined"
        startDecorator={<SyncIcon fontSize="small" />}
        onClick={handleSync}
        disabled={!isSubtitlesFound}
        sx={{
          width: "96px",
          height: "40px",
          border: "none",
          borderRadius: 12,
          color: "white",
          background: "rgba(0,151,185,1)",
          fontWeight: "md",
          "&:hover": {
            backgroundColor: "rgba(0,151,185,1)",
          },
        }}
      >
        Sync
      </Button>
    </Box>
  );
};

export default TimeShifter;
