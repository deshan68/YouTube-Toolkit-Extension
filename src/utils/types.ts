export interface VideoDetails {
  title: string;
  thumbnailUrl: string;
  authorName: string;
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
}
