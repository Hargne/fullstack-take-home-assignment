import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { PlaylistProps, TrackProps } from "~/@types";
import { PlaylistContextProps } from "./PlaylistProvider.types";

export const PlaylistContext = createContext<PlaylistContextProps>(
  {} as PlaylistContextProps
);

export function PlaylistProvider({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  const [playlists, setPlaylists] = useState<Array<PlaylistProps>>([
    {
      id: "1337",
      title: "My First Playlist",
      description: "This is your new playlist",
      tracks: [],
    },
  ]);

  function createPlaylist(data: Omit<PlaylistProps, "id">) {
    const id = Math.random().toString(36).slice(2, 9);
    setPlaylists([...playlists, { id, ...data }]);
  }

  function deletePlaylist(id: PlaylistProps["id"]) {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  }

  function addTracksToPlaylist(id: PlaylistProps["id"], tracks: TrackProps[]) {
    const playlist = playlists.find((playlist) => playlist.id === id);
    if (!playlist) {
      return;
    }
    playlist.tracks.push(...tracks);
    setPlaylists([
      ...playlists.filter((playlist) => playlist.id !== id),
      playlist,
    ]);
  }

  function removeTrackFromPlaylist(
    id: PlaylistProps["id"],
    trackId: TrackProps["id"]
  ) {
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
  }

  const sortedPlaylists = useMemo(
    () =>
      playlists.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }),
    [playlists]
  );

  const value = useMemo(
    () => ({
      playlists: sortedPlaylists,
      createPlaylist,
      deletePlaylist,
      addTracksToPlaylist,
      removeTrackFromPlaylist,
    }),
    [playlists]
  );

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}
