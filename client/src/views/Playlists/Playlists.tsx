import { useContext } from "react";
import { PlaylistContext } from "~/providers/PlaylistProvider/PlaylistProvider";
import styles from "./Playlists.module.css";
import Playlist from "./Playlist";
import CreatePlaylistForm from "~/components/CreatePlaylistForm/CreatePlaylistForm";

export const title = "Playlists";

export default function Playlists() {
  const playlistContext = useContext(PlaylistContext);

  return (
    <div className={styles.wrapper}>
      {playlistContext.playlists.length > 0 ? (
        <div className={styles.playlists} role="list" aria-label="Playlists">
          {playlistContext.playlists.map((playlist) => (
            <div role="listitem" key={playlist.id} aria-label={playlist.title}>
              <Playlist
                playlist={playlist}
                onDelete={playlistContext.deletePlaylist}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.centered}>You have no playlists yet</div>
      )}
      <div className={styles.centered}>
        <CreatePlaylistForm />
      </div>
    </div>
  );
}
