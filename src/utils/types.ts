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
  fontSize: string;
  fontColor: string;
  backgroundOpacity: string;
}
