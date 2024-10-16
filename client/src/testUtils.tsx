import { PropsWithChildren, useState } from "react";
import { PlaylistContext } from "./providers/PlaylistProvider/PlaylistProvider";
import { PlaylistContextProps } from "./providers/PlaylistProvider/PlaylistProvider.types";
import { TrackContext } from "./providers/TrackProvider/TrackProvider";
import { TrackContextProps } from "./providers/TrackProvider/TrackProvider.types";
import { PlaylistProps, TrackProps } from "./@types";

export function MockedPlaylistContext({
  children,
  ...props
}: PropsWithChildren<PlaylistContextProps>) {
  const [playlists, setPlaylists] = useState(props.playlists);

  const createPlaylist = (data: Omit<PlaylistProps, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setPlaylists([...playlists, { id, ...data }]);
  };

  const deletePlaylist = (id: PlaylistProps["id"]) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  };

  const addTracksToPlaylist = (
    id: PlaylistProps["id"],
    tracks: TrackProps[]
  ) => {
    const playlist = playlists.find((playlist) => playlist.id === id);
    if (!playlist) {
      return;
    }
    playlist.tracks.push(...tracks);
    setPlaylists([
      ...playlists.filter((playlist) => playlist.id !== id),
      playlist,
    ]);
  };

  const removeTrackFromPlaylist = (
    id: PlaylistProps["id"],
    trackId: TrackProps["id"]
  ) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((track) => track.id !== trackId),
            }
          : playlist
      )
    );
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        addTracksToPlaylist,
        removeTrackFromPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function MockedTrackContext({
  children,
  ...props
}: PropsWithChildren<TrackContextProps>) {
  const [isPlaying, setIsPlaying] = useState(props.isPlaying);
  const [currentTrack, setCurrentTrack] = useState(props.currentTrack);
  const togglePlayback = (track?: TrackProps) => {
    setCurrentTrack(track);
    if (track && track === currentTrack && isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
  };

  return (
    <TrackContext.Provider
      value={{ ...props, isPlaying, currentTrack, togglePlayback }}
    >
      {children}
    </TrackContext.Provider>
  );
}
