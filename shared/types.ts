export enum MessageTypes {
  OPEN_POPUP = "OPEN_POPUP",
  SEND_VIDEO_ID = "SEND_VIDEO_ID",
  SEARCH_INITIAL_SUBTITLES = "SEARCH_INITIAL_SUBTITLES",
  SEND_VIDEO_DETAILS = "SEND_VIDEO_DETAILS",
  REMOVE_SUBTITLES_ELEMENT = "REMOVE_SUBTITLES_ELEMENT",
  APPLY_SUBTITLES = "APPLY_SUBTITLES",
  APPLY_SUBTITLE_STYLE = "APPLY_SUBTITLE_STYLE",
}

export type Message = {
  type: MessageTypes;
  body?: Record<string, unknown>;
};

export type UrlValidation = { isVideoSelected: boolean; isOnYoutube: boolean };

export enum StorageKeys {
  SUBTITLES = "SUBTITLES",
  PLAYLIST = "playlist",
  videoList = "videoList",
}
