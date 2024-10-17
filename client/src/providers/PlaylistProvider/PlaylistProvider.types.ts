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

export type GetPlaylistsResponse = Array<PlaylistProps>;

export type CreatePlaylistPayload = {
  title: PlaylistProps["title"];
  tracks: Array<TrackProps["id"]>;
};

export type CreatePlaylistResponse = PlaylistProps;

export type AddTrackToPlaylistPayload = {
  tracks: Array<TrackProps["id"]>;
};
