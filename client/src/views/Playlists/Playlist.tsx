import Icon from "~/components/Icon/Icon";
import styles from "./Playlists.module.css";
import { PlaylistProps } from "~/@types";
import TrackList from "~/components/TrackList/TrackList";
import { useState } from "react";
import Button from "~/components/Button/Button";

type Props = {
  playlist: PlaylistProps;
  onDelete: (id: string) => void;
};

export default function Playlist(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  function handleDelete() {
    props.onDelete(props.playlist.id);
  }

  function renderDeleteButton() {
    return (
      <div>
        <Button
          variant="error"
          onClick={handleDelete}
          aria-label="Delete playlist"
        >
          <Icon variant="remove" size="small" fill="inherit" /> Delete playlist
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.playlist}>
      <button
        className={`${styles.playlistHeader} ${isOpen ? styles.open : ""}`}
        tabIndex={0}
        role="button"
        onClick={toggleOpen}
        aria-label="Toggle playlist"
      >
        <h2>{props.playlist.title}</h2>
        <div className={styles.trackLength}>
          {props.playlist.tracks.length}{" "}
          {props.playlist.tracks.length === 1 ? "track" : "tracks"}
        </div>
        <Icon variant={isOpen ? "chevronUp" : "chevronDown"} />
      </button>
      {isOpen && (
        <div className={styles.playlistContent}>
          {props.playlist.tracks.length === 0 ? (
            <div className={styles.emptyPlaylist}>
              This playlist is empty
              {renderDeleteButton()}
            </div>
          ) : (
            <>
              <TrackList
                tracks={props.playlist.tracks}
                playlist={props.playlist}
              />
              <div className={styles.playlistDetailsBar}>
                {renderDeleteButton()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
