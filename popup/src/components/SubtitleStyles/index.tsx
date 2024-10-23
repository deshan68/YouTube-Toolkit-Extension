import { Box, Typography } from "@mui/material";
import {
  colorsArray,
  defaultSubtitleStyle,
  HomePageBoxStyle,
} from "../../constants/constants";
import CheckIcon from "@mui/icons-material/Check";
import sample_video from "../../assets/sample_video.mp4";
import { Slider } from "@mui/joy";
import { valueText } from "../../utils/utils";
import { useEffect, useState } from "react";
import { DefaultFontsize, StyleSetting } from "../../utils/types";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../../shared/chrome-utils";
import { MessageTypes } from "../../../../shared/types";

const enumKeys = Object.keys(DefaultFontsize) as Array<
  keyof typeof DefaultFontsize
>;

const SubtitleStyles = () => {
  const [styleSetting, setStyleSetting] = useState<StyleSetting | null>(null);

  const handleStyleChange = (updatedStyles: StyleSetting) => {
    storeStyleSetting(updatedStyles);
    _subtitleStart(updatedStyles);
  };

  const getStoredSubtitleStyle = async () => {
    const storedSubtitlesStyle = await getStorage<StyleSetting>(
      "subtitleStyle"
    );

    if (storedSubtitlesStyle) return setStyleSetting(storedSubtitlesStyle);

    //set style if not store in local storage
    storeStyleSetting(defaultSubtitleStyle);
  };

  const storeStyleSetting = async (_styleSetting: StyleSetting) => {
    await setStorage("subtitleStyle", JSON.stringify(_styleSetting)).then(
      () => {
        setStyleSetting(_styleSetting);
      }
    );
  };

  const _subtitleStart = async (updatedStyles: StyleSetting): Promise<void> => {
    await sendMessageToContent<{}>({
      type: MessageTypes.APPLY_SUBTITLE_STYLE,
      body: { updatedStyles },
    });
  };

  useEffect(() => {
    getStoredSubtitleStyle();
  }, []);

  if (!styleSetting) {
    return null;
  }

  return (
    <Box sx={HomePageBoxStyle}>
      {/* size and color */}
      <Box
        sx={{
          width: "330px", // Adjust width as needed
          px: 2,
          py: 2,
          bgcolor: "#262626",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* size */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "#989898",
            }}
          >
            Font size
          </Typography>
          <Box sx={{ display: "flex", columnGap: 1 }}>
            {[
              DefaultFontsize.Small,
              DefaultFontsize.Medium,
              DefaultFontsize.Large,
            ].map((i, index) => (
              <Box
                sx={{
                  fontSize: "12px",
                  bgcolor: styleSetting?.fontSize === i ? "#fff" : null,
                  color: styleSetting?.fontSize === i ? "#000" : "#989898",
                  border: "1px solid #989898",
                  borderRadius: "15px",
                  px: 1.5,
                  py: 0.2,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#fff",
                    color: "#000",
                  },
                }}
                onClick={() => {
                  if (styleSetting) {
                    const newStyles = {
                      ...styleSetting,
                      fontSize: i,
                    };
                    handleStyleChange(newStyles);
                  }
                }}
              >
                {enumKeys[index]}
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{ height: "0.1px", width: "100%", bgcolor: "#989898", my: 1.5 }}
        />

        {/* font color */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "#989898",
            }}
          >
            Font color
          </Typography>
          <Box sx={{ display: "flex", columnGap: 2 }}>
            {colorsArray.map((color) => (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: color,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  if (styleSetting) {
                    const newStyles = {
                      ...styleSetting,
                      fontColor: color,
                    };
                    handleStyleChange(newStyles);
                  }
                }}
              >
                {styleSetting?.fontColor === color && (
                  <CheckIcon
                    sx={{
                      fontSize: "12px",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* opacity */}
      <Box
        sx={{
          width: "330px", // Adjust width as needed
          px: 2,
          py: 2,
          bgcolor: "#262626",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          mt: 1,
        }}
      >
        {/* opacity */}
        <Typography
          sx={{
            fontSize: "12px",
            color: "#989898",
          }}
        >
          Background opacity
        </Typography>
        <Slider
          defaultValue={Number(styleSetting?.backgroundOpacity) * 100}
          getAriaValueText={valueText}
          step={20}
          marks
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            const _value = value as number;
            if (styleSetting) {
              const newStyles = {
                ...styleSetting,
                backgroundOpacity: `${_value / 100}`,
              };
              handleStyleChange(newStyles);
            }
          }}
          sx={{
            // Custom thickness for the track and rail
            "& .MuiSlider-track": {
              height: 3, // Adjust thickness of the track
              bgcolor: "#ffff", // Change the track color
            },
            "& .MuiSlider-rail": {
              height: 2, // Adjust thickness of the rail
              bgcolor: "#989898", // Change the rail color (inactive track)
            },
          }}
        />
      </Box>

      {/* previewer */}
      <Box
        sx={{
          position: "relative",
          width: 330,
          height: 190,
          borderRadius: "10px",
          overflow: "hidden",
          mt: 9,
        }}
      >
        {/* Video inside the Box */}
        <video
          src={sample_video}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          muted
          loop
        />

        {/* Typography overlay */}
        <Typography
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            width: "95%",
            transform: "translate(-50%, -10%)",
            color: styleSetting?.fontColor,
            backgroundColor: `rgba(0, 0, 0, ${styleSetting?.backgroundOpacity})`,
            padding: "5px 10px",
            textAlign: "center",
            fontSize: styleSetting?.fontSize,
            lineHeight: 1,
          }}
        >
          How subtitles look on YouTube
        </Typography>
      </Box>
    </Box>
  );
};

export default SubtitleStyles;
