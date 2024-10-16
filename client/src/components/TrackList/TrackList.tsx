import { useContext } from "react";
import { PlaylistProps, TrackProps } from "~/@types";
import TrackRow from "~/components/TrackRow/TrackRow";
import { TrackContext } from "~/providers/TrackProvider/TrackProvider";
import styles from "./TrackList.module.css";

type Props = {
  tracks: TrackProps[];
  playlist?: PlaylistProps;
};

export default function TrackList(props: Props) {
  const trackContext = useContext(TrackContext);

  return (
    <ul className={styles.trackList} role="list">
      {props.tracks.map((track) => (
        <li
          key={track.id}
          role="listitem"
          aria-label={`${track.title} by ${track.main_artists.join(", ")}`}
        >
          <TrackRow
            track={track}
            isPlaying={
              track === trackContext.currentTrack && trackContext.isPlaying
            }
            onTogglePlayback={trackContext.togglePlayback}
            playlist={props.playlist}
          />
        </li>
      ))}
    </ul>
  );
}
