import { PlaylistProps } from "~/@types";
import { mockedTrackList } from "./track.mock";

export const mockedPlaylist: Array<PlaylistProps> = [
  {
    id: "1",
    title: "First playlist",
    tracks: [],
  },
  {
    id: "2",
    title: "Second playlist",
    tracks: mockedTrackList,
  },
  {
    id: "3",
    title: "Third playlist",
    tracks: mockedTrackList,
  },
];
