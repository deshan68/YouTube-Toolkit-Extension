import { UrlValidation } from "./types";

export const prepareUrl = (id: string) => {
  return location.origin + location.pathname + `#${id}`;
};

export const checkIsValidUrl = (url: string): UrlValidation => {
  let urlValidation: UrlValidation = {
    isVideoSelected: false,
    isOnYoutube: false,
  };
  if (url.includes("www.youtube.com")) {
    if (url.includes("watch?v=")) {
      urlValidation.isVideoSelected = true;
    }
    urlValidation.isOnYoutube = true;
  }

  return urlValidation;
};
