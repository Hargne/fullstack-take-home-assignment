import TrackRow, { TrackRowProps } from "~/components/TrackRow/TrackRow";
import styles from "./AudioPlayer.module.css";

type Props = TrackRowProps;

export default function AudioPlayer(props: Props) {
  return (
    <div className={styles.audioPlayer} role="region" aria-label="Audio Player">
      <TrackRow {...props} bright menuDirection="top" />
    </div>
  );
}
