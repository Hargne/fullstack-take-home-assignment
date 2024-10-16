import { forwardRef, useContext, useState } from "react";
import { Popover } from "react-tiny-popover";
import { PlaylistProps, TrackProps } from "~/@types";
import { PlaylistContext } from "~/providers/PlaylistProvider/PlaylistProvider";
import AddToPlaylist from "./AddToPlaylist";
import TrackActionMenuItem from "./TrackActionActionMenuItem";
import styles from "./TrackActionMenu.module.css";

export type TrackActionMenuProps = {
  track: TrackProps;
  menuDirection?: "top" | "bottom";
  playlist?: PlaylistProps;
};

const TrackActionMenu = forwardRef<HTMLUListElement, TrackActionMenuProps>(
  (props, ref) => {
    const playlistContext = useContext(PlaylistContext);
    const [showSubMenu, setShowSubMenu] = useState(false);

    function displayPlaylists() {
      setShowSubMenu(true);
    }

    function toggleDisplayPlaylists() {
      setShowSubMenu(!showSubMenu);
    }

    function handleRemoveFromPlaylist() {
      if (!props.playlist) {
        return;
      }
      playlistContext.removeTrackFromPlaylist(
        props.playlist.id,
        props.track.id
      );
    }

    if (props.playlist) {
      return (
        <ul
          className={styles.actionMenu}
          tabIndex={0}
          role="list"
          aria-label="Track Actions"
        >
          <TrackActionMenuItem
            label="Remove from playlist"
            icon="remove"
            variant="primary"
            onClick={handleRemoveFromPlaylist}
          />
        </ul>
      );
    }

    return (
      <Popover
        isOpen={showSubMenu}
        positions={["left", "bottom", "top", "right"]}
        padding={8}
        reposition={false}
        align={props.menuDirection === "top" ? "end" : "start"}
        content={<AddToPlaylist track={props.track} ref={ref} />}
      >
        <ul
          className={styles.actionMenu}
          tabIndex={0}
          role="list"
          aria-label="Track Actions"
        >
          <TrackActionMenuItem
            label="Add to playlist"
            icon="chevronRight"
            variant="primary"
            onClick={toggleDisplayPlaylists}
            onMouseOver={displayPlaylists}
          />
        </ul>
      </Popover>
    );
  }
);
TrackActionMenu.displayName = "TrackActionMenu";
export default TrackActionMenu;
