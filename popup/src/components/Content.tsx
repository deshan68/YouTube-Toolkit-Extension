import { Box } from "@mui/joy";
import { Toolbar } from "@mui/material";
import { bannerTitles } from "../constants/constants";
import BottomNavComponent from "./BottomNavComponent";
import SVGBanner from "./SVGBanner";
import invalidUrlSvg from "../assets/dreamer.svg";
import { MessageTypes, UrlValidation } from "../../../shared/types";
import { useEffect, useState } from "react";
import { sendMessageToContent } from "../../../shared/chrome-utils";

const Content = () => {
  const [isValidUrl, setIsValidUrl] = useState<UrlValidation | undefined>(
    undefined
  );

  const checkCurrentURL = async () => {
    const response = await sendMessageToContent<{
      isOnYoutube: boolean;
      isVideoSelected: boolean;
    }>({
      type: MessageTypes.OPEN_POPUP,
    });
    setIsValidUrl(response);
  };

  useEffect(() => {
    checkCurrentURL();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        width: "350px",
      }}
    >
      <Toolbar />
      {isValidUrl?.isOnYoutube ? (
        <BottomNavComponent />
      ) : (
        <SVGBanner svg={invalidUrlSvg} title={bannerTitles.INVALID_URL} />
      )}
    </Box>
  );
};

export default Content;
