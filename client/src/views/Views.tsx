import * as Tracks from "./Tracks/Tracks";
import * as Playlists from "./Playlists/Playlists";

export const allViews: {
  [key: string]: { title: string; component: () => JSX.Element };
} = {
  tracks: {
    title: Tracks.title,
    component: Tracks.default,
  },
  playlists: {
    title: Playlists.title,
    component: Playlists.default,
  },
};

export type View = keyof typeof allViews;
