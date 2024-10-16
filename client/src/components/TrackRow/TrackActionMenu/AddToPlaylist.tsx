import { forwardRef, useContext, useState } from "react";
import { PlaylistProps, TrackProps } from "~/@types";
import CreatePlaylistForm from "~/components/CreatePlaylistForm/CreatePlaylistForm";
import { PlaylistContext } from "~/providers/PlaylistProvider/PlaylistProvider";
import TrackActionMenuItem from "./TrackActionActionMenuItem";
import styles from "./TrackActionMenu.module.css";

export type TrackActionMenuItemProps = {
  track: TrackProps;
};

const AddToPlaylist = forwardRef<HTMLUListElement, TrackActionMenuItemProps>(
  (props, ref) => {
    const playlistContext = useContext(PlaylistContext);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

    const isTrackInPlaylist = (playlist: PlaylistProps) => {
      if (!playlist.tracks) return false;
      return playlist.tracks.some((track) => track.id === props.track.id);
    };

    function handlePlaylistClick(playlist: PlaylistProps) {
      if (isTrackInPlaylist(playlist)) {
        playlistContext.removeTrackFromPlaylist(playlist.id, props.track.id);
      } else {
        playlistContext.addTracksToPlaylist(playlist.id, [props.track]);
      }
    }

    function toggleShowCreatePlaylist() {
      setShowCreatePlaylist(!showCreatePlaylist);
    }

    return (
      <ul
        className={styles.actionMenu}
        ref={ref}
        role="list"
        aria-label="Select playlist to add track to"
      >
        {playlistContext.playlists.map((playlist) => (
          <TrackActionMenuItem
            key={playlist.id}
            label={`Add to ${playlist.title}`}
            icon={isTrackInPlaylist(playlist) ? "check" : "add"}
            variant={isTrackInPlaylist(playlist) ? "primary" : undefined}
            onClick={() => handlePlaylistClick(playlist)}
            selected={isTrackInPlaylist(playlist)}
          >
            {playlist.title}
          </TrackActionMenuItem>
        ))}
        <li className={styles.divider} aria-label="divider" />
        <TrackActionMenuItem
          label="New playlist"
          icon={showCreatePlaylist ? "chevronUp" : "chevronDown"}
          onClick={toggleShowCreatePlaylist}
        />
        {showCreatePlaylist && (
          <TrackActionMenuItem label="New playlist form">
            <CreatePlaylistForm
              tracks={[props.track]}
              onComplete={() => setShowCreatePlaylist(false)}
            />
          </TrackActionMenuItem>
        )}
      </ul>
    );
  }
);
AddToPlaylist.displayName = "AddToPlaylist";
export default AddToPlaylist;
