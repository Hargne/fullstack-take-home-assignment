import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PlaylistProps, TrackProps } from "~/@types";
import {
  AddTrackToPlaylistPayload,
  CreatePlaylistPayload,
  CreatePlaylistResponse,
  GetPlaylistsResponse,
  PlaylistContextProps,
} from "./PlaylistProvider.types";

export const PlaylistContext = createContext<PlaylistContextProps>(
  {} as PlaylistContextProps
);

export function PlaylistProvider({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  const [playlists, setPlaylists] = useState<Array<PlaylistProps>>([]);

  async function fetchPlaylists(): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/`, {
      mode: "cors",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }
    const data = (await response.json()) as GetPlaylistsResponse;
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response");
    }
    setPlaylists(data);
  }

  async function createPlaylist(
    data: Omit<PlaylistProps, "id">
  ): Promise<PlaylistProps> {
    const payload: CreatePlaylistPayload = {
      title: data.title,
      tracks: data.tracks.map((track) => track.id),
    };
    const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }
    const createdPlaylist = (await response.json()) as CreatePlaylistResponse;
    setPlaylists([...playlists, createdPlaylist]);
    return createdPlaylist;
  }

  async function deletePlaylist(id: PlaylistProps["id"]): Promise<void> {
    const cachedPlaylists = playlists;
    // We apply the changes optimistically for a snappy UI
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists/${id}`,
        {
          method: "DELETE",
          mode: "cors",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to delete playlist", error);
      // Revert changes
      setPlaylists(cachedPlaylists);
      return Promise.reject(error);
    }
  }

  async function addTracksToPlaylist(
    id: PlaylistProps["id"],
    tracks: TrackProps[]
  ): Promise<void> {
    const playlist = playlists.find((playlist) => playlist.id === id);
    try {
      if (!playlist) {
        throw new Error("Playlist not found");
      }
      // We apply the changes optimistically for a snappy UI
      setPlaylists([
        ...playlists.filter((playlist) => playlist.id !== id),
        {
          ...playlist,
          tracks: [...playlist.tracks, ...tracks],
        },
      ]);

      const data: AddTrackToPlaylistPayload = {
        tracks: tracks.map((track) => track.id),
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists/${playlist.id}/tracks/`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Could not add tracks to playlist");
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to add tracks to playlist", error);
      // Revert changes
      if (playlist) {
        console.log("Reverting changes", playlist);
        setPlaylists([
          ...playlists.filter((playlist) => playlist.id !== id),
          playlist,
        ]);
      }
      return Promise.reject(error);
    }
  }

  async function removeTrackFromPlaylist(
    id: PlaylistProps["id"],
    trackId: TrackProps["id"]
  ): Promise<void> {
    const playlist = playlists.find((playlist) => playlist.id === id);
    try {
      if (!playlist) {
        throw new Error("Playlist not found");
      }
      // We apply the changes optimistically for a snappy UI
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists/${id}/tracks/${trackId}`,
        {
          method: "DELETE",
          mode: "cors",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to remove track from playlist", error);
      // Revert changes
      if (playlist) {
        console.log("Reverting changes", playlist);
        setPlaylists([
          ...playlists.filter((playlist) => playlist.id !== id),
          playlist,
        ]);
      }
      return Promise.reject(error);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const sortedPlaylists = useMemo(
    () =>
      playlists.sort((a, b) => {
        return a.id < b.id ? -1 : 1;
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
