export type ActionState = "INTITAL" | "LOADING" | "SUCCESS" | "ERROR";

export type TrackProps = {
  id: string;
  title: string;
  length: number;
  bpm: number;
  genres: string[];
  moods: string[];
  main_artists: string[];
  featured_artists: string[];
  audio: string;
  cover_art: string;
  waveform: string;
  spotify: string;
};

export type PlaylistProps = {
  id: string;
  title: string;
  description: string;
  tracks: Array<TrackProps>;
};
