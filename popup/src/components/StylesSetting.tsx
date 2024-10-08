import { Box, Button, Typography } from "@mui/material";
import { FadedDivider } from "./FadedDivider";
import { Slider } from "@mui/joy";
import { StyleSetting } from "../utils/types";
import { useEffect, useState } from "react";
import { colors } from "../constants/constants";
import {
  getFontSizeHandlerButton,
  getStoredStyleSetting,
} from "../utils/utils";
import CheckIcon from "@mui/icons-material/Check";
import { setStorage } from "../../../shared/chrome-utils";

const StylesSetting = () => {
  const [styleSetting, setStyleSetting] = useState<StyleSetting | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedFontSize, setSelectedFontSize] = useState<string>("");
  const [storedBgOpacity, setStoredBgOpacity] = useState<string>("");

  const valueText = (value: number): string => {
    return `${value}%`;
  };

  const handleStyleChange = async (setting: StyleSetting): Promise<void> => {
    const storedStyleSetting = await getStoredStyleSetting();
    if (storedStyleSetting) {
      await setStorage("styleSetting", JSON.stringify(setting));
      setStyleSetting(setting);
      setSelectedColor(setting.fontColor);
      setSelectedFontSize(setting.fontSize);
      subtitleStart(setting);
    }
  };

  const subtitleStart = async (setting: StyleSetting): Promise<void> => {
    try {
      let [tab] = await chrome.tabs.query({ active: true });
      const _setting = JSON.stringify(setting);
      chrome.scripting.executeScript<string[], void>({
        target: { tabId: tab.id! },
        args: [_setting],
        func: (_setting) => {
          const styleSetting: StyleSetting = JSON.parse(_setting);
          const subtitleDiv = document.querySelector(
            ".sub-title-div"
          ) as HTMLElement;

          if (subtitleDiv) {
            subtitleDiv.style.color = styleSetting.fontColor;
            subtitleDiv.style.fontSize = styleSetting.fontSize;
            subtitleDiv.style.backgroundColor = `rgba(0, 0, 0, ${styleSetting.backgroundOpacity})`;
          }
        },
      });
    } catch (error) {
      console.error("Error executing script:", error);
    }
  };

  useEffect(() => {
    getAllStyles();
  }, []);

  const getAllStyles = async () => {
    setStyleSetting(await getStoredStyleSetting());
    setSelectedColor((await getStoredStyleSetting()).fontColor);
    setSelectedFontSize((await getStoredStyleSetting()).fontSize);
    setStoredBgOpacity((await getStoredStyleSetting()).backgroundOpacity);
  };

  if (
    !styleSetting ||
    !selectedColor ||
    !selectedFontSize ||
    !storedBgOpacity
  ) {
    return null;
  }
  
  return (
    <Box
      sx={{
        pt: 5,
        display: "flex",
        width: "100%",
        rowGap: 3,
        flexDirection: "column",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          variant="contained"
          sx={getFontSizeHandlerButton(
            selectedFontSize === "42px" ? "#333333" : "#1E1E1E"
          )}
          onClick={() => {
            let _styleSetting = styleSetting;
            if (_styleSetting) {
              _styleSetting.fontSize = "42px";
              handleStyleChange(_styleSetting);
            }
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              textTransform: "capitalize",
            }}
          >
            Large
          </Typography>
        </Button>
        <Button
          variant="contained"
          sx={getFontSizeHandlerButton(
            selectedFontSize === "36px" ? "#333333" : "#1E1E1E"
          )}
          onClick={() => {
            let _styleSetting = styleSetting;
            if (_styleSetting) {
              _styleSetting.fontSize = "36px";
              handleStyleChange(_styleSetting);
            }
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              textTransform: "capitalize",
            }}
          >
            Medium
          </Typography>
        </Button>
        <Button
          variant="contained"
          sx={getFontSizeHandlerButton(
            selectedFontSize === "30px" ? "#333333" : "#1E1E1E"
          )}
          onClick={() => {
            let _styleSetting = styleSetting;
            if (_styleSetting) {
              _styleSetting.fontSize = "30px";
              handleStyleChange(_styleSetting);
            }
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              textTransform: "capitalize",
            }}
          >
            Small
          </Typography>
        </Button>
      </Box>
      <FadedDivider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "#989898",
          }}
        >
          Subtitle Color
        </Typography>
        {colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: "30px",
              height: "30px",
              bgcolor: color,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              let _styleSetting = styleSetting;
              if (_styleSetting) {
                _styleSetting.fontColor = color;
                handleStyleChange(_styleSetting);
              }
            }}
          >
            {selectedColor === color && <CheckIcon fontSize="small" />}
          </Box>
        ))}
      </Box>
      <FadedDivider />
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: "#989898",
          }}
        >
          Background Opacity
        </Typography>
        <Slider
          defaultValue={Number(storedBgOpacity) * 100}
          getAriaValueText={valueText}
          step={20}
          marks
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            let _styleSetting = styleSetting;
            if (_styleSetting) {
              let _value = value as number;
              _styleSetting.backgroundOpacity = `${_value / 100}`;
              handleStyleChange(_styleSetting);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default StylesSetting;
