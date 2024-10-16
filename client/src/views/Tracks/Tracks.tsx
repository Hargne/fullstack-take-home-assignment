import { useContext } from "react";
import { TrackContext } from "~/providers/TrackProvider/TrackProvider";
import TrackList from "~/components/TrackList/TrackList";

export const title = "Tracks";

export default function Tracks() {
  const trackContext = useContext(TrackContext);

  return <TrackList tracks={trackContext.tracks} />;
}
