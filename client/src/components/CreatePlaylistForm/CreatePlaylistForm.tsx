import TextField from "~/components/TextField/TextField";
import styles from "./CreatePlaylistForm.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { PlaylistContext } from "~/providers/PlaylistProvider/PlaylistProvider";
import { TrackProps } from "~/@types";
import Button from "~/components/Button/Button";

type CreatePlaylistFormProps = {
  tracks?: Array<TrackProps>;
  onComplete?: () => void;
};

export default function CreatePlaylistForm(props: CreatePlaylistFormProps) {
  const playlistContext = useContext(PlaylistContext);
  const playlistNameInputRef = useRef<HTMLInputElement>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  function handleCreatePlaylist() {
    if (!newPlaylistName || newPlaylistName.length < 1) {
      return;
    }
    playlistContext.createPlaylist({
      title: newPlaylistName,
      description: "",
      tracks: props.tracks ?? [],
    });
    setNewPlaylistName("");
    if (playlistNameInputRef.current) {
      playlistNameInputRef.current.blur();
    }
    if (props.onComplete) {
      props.onComplete();
    }
  }

  useEffect(() => {
    if (playlistNameInputRef.current) {
      playlistNameInputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.createPlaylistForm}>
      <TextField
        ref={playlistNameInputRef}
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        type="text"
        aria-label="Playlist name"
        placeholder="Playlist name..."
      />
      <Button type="button" onClick={handleCreatePlaylist}>
        Create playlist
      </Button>
    </div>
  );
}
