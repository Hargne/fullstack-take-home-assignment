import { ChangeEvent, useRef, useState } from "react";
import { Popover } from "react-tiny-popover";
import { PlaylistProps, TrackProps } from "~/@types";
import ActionButton from "~/components/ActionButton/ActionButton";
import TrackActionMenu from "./TrackActionMenu/TrackActionMenu";
import styles from "./TrackRow.module.css";

export type TrackRowProps = {
  track: TrackProps;
  isPlaying: boolean;
  onTogglePlayback: (track: TrackProps) => void;
  playbackProgress?: number;
  onSetPlaybackPosition?: (progress: number) => void;
  brightBackground?: boolean;
  menuDirection?: "top" | "bottom";
  playlist?: PlaylistProps;
};

export default function TrackRow(props: Readonly<TrackRowProps>) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLUListElement>(null);

  function handleTogglePlayback() {
    props.onTogglePlayback(props.track);
  }

  const handlePlaybackPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!props.onSetPlaybackPosition) {
      return;
    }
    props.onSetPlaybackPosition(parseInt(e.target.value, 10) / 1000);
  };

  const handleActionMenuToggle = () => {
    setShowActionMenu(!showActionMenu);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    if (!actionMenuRef.current?.contains(targetElement)) {
      setShowActionMenu(false);
    }
  };

  return (
    <div className={styles.track} tabIndex={0} ref={containerRef}>
      <ActionButton
        icon={props.isPlaying ? "pause" : "play"}
        onClick={handleTogglePlayback}
        aria-label={
          props.isPlaying ? "Pause track" : `Play ${props.track.title}`
        }
        active={props.isPlaying}
        inverted={props.brightBackground}
      />
      <div className={styles.midSection}>
        <div
          className={`${styles.trackInfo} ${
            props.playbackProgress ? styles.withSlider : ""
          }`}
        >
          <div
            className={`${styles.trackTitle} ${
              props.brightBackground && styles.bright
            }`}
          >
            {props.track.title}
          </div>
          <div
            className={`${styles.trackArtist} ${
              props.brightBackground && styles.bright
            }`}
          >
            {props.track.main_artists.join(", ")}
          </div>
        </div>
        {props.playbackProgress && (
          <input
            aria-label="Playback progress"
            type="range"
            min="1"
            max="1000"
            value={props.playbackProgress * 1000}
            className={styles.playbackProgressSlider}
            onChange={handlePlaybackPositionChange}
          />
        )}
      </div>
      <Popover
        isOpen={showActionMenu}
        positions={
          props.menuDirection === "top" ? ["top", "bottom"] : ["bottom", "top"]
        }
        content={
          <TrackActionMenu
            track={props.track}
            ref={actionMenuRef}
            menuDirection={props.menuDirection}
            playlist={props.playlist}
          />
        }
        onClickOutside={handleClickOutside}
        align="end"
        reposition={false}
        padding={8}
      >
        <ActionButton
          icon="more"
          variant="no-background"
          aria-label="Toggle track actions"
          inverted={props.brightBackground}
          onClick={handleActionMenuToggle}
          active={showActionMenu}
        />
      </Popover>
    </div>
  );
}
