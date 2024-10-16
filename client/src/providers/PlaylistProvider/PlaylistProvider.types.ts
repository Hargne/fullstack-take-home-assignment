import { PlaylistProps, TrackProps } from "~/@types";

export type PlaylistContextProps = {
  playlists: Array<PlaylistProps>;
  createPlaylist: (data: Omit<PlaylistProps, "id">) => void;
  deletePlaylist: (id: PlaylistProps["id"]) => void;
  addTracksToPlaylist: (id: PlaylistProps["id"], tracks: TrackProps[]) => void;
  removeTrackFromPlaylist: (
    id: PlaylistProps["id"],
    trackId: TrackProps["id"]
  ) => void;
};
