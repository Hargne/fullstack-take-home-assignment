import { TrackProps } from "~/@types";

export type TrackContextProps = {
  tracks: Array<TrackProps>;
  fetchTracks: () => Promise<void>;
  currentTrack?: TrackProps;
  togglePlayback: (track?: TrackProps) => void;
  isPlaying: boolean;
};

export type GetTracksResponse = Array<TrackProps>;
