export interface VideoDetails {
  title: string;
  thumbnailUrl: string;
  authorName: string;
  videoUrl: string;
}

export interface Subtitle {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleSyncRecordType {
  id: string;
  subtitleResyncTime: number;
  syncedSubtitles: Subtitle[];
  fileName: string;
  isVideoSave: boolean;
}

export interface SavedItemDetails {
  videoId: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoAuthorName?: string;
}

export interface StyleSetting {
  fontSize: DefaultFontsize;
  fontColor: string;
  backgroundOpacity: string;
}

export enum DefaultFontsize {
  Small = "18px",
  Medium = "36px",
  Large = "42px",
}

export interface PlaylistItem {
  id: number;
  folderName: string;
  folderDescription: string;
  folderColor: string;
  videoIdList: string[];
}
