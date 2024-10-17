// TrackProvider.test.tsx
import { useContext } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import { PlaylistContext, PlaylistProvider } from "./PlaylistProvider";
import { PlaylistProps } from "~/@types";
import { mockedTrackList } from "~/__mocks__/track.mock";
import { mockedPlaylist } from "~/__mocks__/playlist.mock";

jest.mock("~/constants", () => ({
  API_URL: "http://mocked-url",
}));

describe("PlaylistProvider", () => {
  const unmockedFetch = global.fetch;
  beforeAll(() => {
    global.fetch = jest.fn((_url: string, { method }: RequestInit) => {
      if (method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id:
                Math.random().toString(36).substring(2, 9) +
                Date.now().toString(36).toString(),
              title: "New Playlist",
              tracks: [],
            }),
        });
      }
      if (method === "DELETE") {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedPlaylist),
      });
    }) as jest.Mock;
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  const TestComponent = () => {
    const playlistContext = useContext(PlaylistContext);

    function newPlaylist() {
      playlistContext.createPlaylist({
        title: "New Playlist",
        tracks: [],
      });
    }

    function deletePlaylist(id: PlaylistProps["id"]) {
      playlistContext.deletePlaylist(id);
    }

    function addTracksToPlaylist(id: PlaylistProps["id"]) {
      playlistContext.addTracksToPlaylist(id, [mockedTrackList[0]]);
    }

    function removeTrackFromPlaylist(
      id: PlaylistProps["id"],
      trackId: PlaylistProps["id"]
    ) {
      playlistContext.removeTrackFromPlaylist(id, trackId);
    }

    return (
      <div>
        <button onClick={newPlaylist}>Create Playlist</button>
        <ul role="list" aria-label="playlists">
          {playlistContext.playlists.map((playlist) => (
            <div key={playlist.id} role="listitem" aria-label={playlist.title}>
              <h3>{playlist.title}</h3>
              <button onClick={() => deletePlaylist(playlist.id)}>
                Delete
              </button>
              <button onClick={() => addTracksToPlaylist(playlist.id)}>
                Add Track
              </button>
              <ul role="list" aria-label="tracks">
                {playlist.tracks.map((track) => (
                  <li key={track.id} role="listitem" aria-label={track.title}>
                    {track.title}
                    <button
                      onClick={() =>
                        removeTrackFromPlaylist(playlist.id, track.id)
                      }
                    >
                      Remove Track
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  it("should be possible to create a playlist, add/remove tracks and also delete the entire playlist", async () => {
    render(
      <PlaylistProvider>
        <TestComponent />
      </PlaylistProvider>
    );

    const playlists = screen.getByRole("list", { name: "playlists" });

    // Test creating a playlist
    await userEvent.click(screen.getByText("Create Playlist"));
    await waitFor(() =>
      expect(
        within(playlists).getByRole("listitem", { name: "New Playlist" })
      ).toBeInTheDocument()
    );

    const playlist = within(playlists).getByRole("listitem", {
      name: "New Playlist",
    });

    // Test adding and removing a track
    await userEvent.click(
      within(playlist).getByRole("button", { name: "Add Track" })
    );
    await waitFor(() =>
      expect(
        within(playlist).getByRole("listitem", {
          name: mockedTrackList[0].title,
        })
      ).toBeInTheDocument()
    );
    await userEvent.click(
      within(playlist).getByRole("button", { name: "Remove Track" })
    );
    await waitFor(() =>
      expect(
        within(playlist).queryByRole("listitem", {
          name: mockedTrackList[0].title,
        })
      ).not.toBeInTheDocument()
    );

    // Test deleting the playlist
    await userEvent.click(
      within(playlist).getByRole("button", { name: "Delete" })
    );
    await waitFor(() =>
      expect(
        within(playlists).queryByRole("listitem", { name: "New Playlist" })
      ).not.toBeInTheDocument()
    );
  });
});
