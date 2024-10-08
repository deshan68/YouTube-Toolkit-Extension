import { StyleSetting, Subtitle } from "../popup/src/utils/types";
import { Message, MessageTypes } from "../shared/types";
import {
  onApplySubtitles,
  onOpenPopup,
  onRemoveSubtitlesElement,
  onSearchInitialSubtitle,
  onSendVideoDetails,
  onSendVideoId,
} from "./onMessageHandlers";

const registerEventListeners = () => {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      switch (message.type) {
        case MessageTypes.OPEN_POPUP: {
          onOpenPopup().then((urlValidation) => {
            sendResponse(urlValidation);
          });
          return true;
        }
        case MessageTypes.SEND_VIDEO_ID: {
          sendResponse({ videoId: onSendVideoId() });
          return true;
        }
        case MessageTypes.SEARCH_INITIAL_SUBTITLES: {
          onSearchInitialSubtitle().then((isSubtitlesOn) => {
            sendResponse({ isSubtitlesOn });
          });
          return true;
        }
        case MessageTypes.SEND_VIDEO_DETAILS: {
          onSendVideoDetails().then((videoDetails) => {
            sendResponse({ videoDetails });
          });
          return true;
        }
        case MessageTypes.REMOVE_SUBTITLES_ELEMENT: {
          onRemoveSubtitlesElement().then(() => {
            sendResponse();
          });
          return true;
        }
        case MessageTypes.APPLY_SUBTITLES: {
          sendResponse({
            isSubtitleOn: onApplySubtitles(
              message.body?.subtitles as Subtitle[],
              message.body?.styleSetting as StyleSetting,
              message.body?.currentUrlId as string
            ),
          });
          return true;
        }
        default:
          return false;
      }
    }
  );
};

(() => {
  registerEventListeners();
})();
