// TrackProvider.test.tsx
import { useContext } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import { PlaylistContext, PlaylistProvider } from "./PlaylistProvider";
import { PlaylistProps } from "~/@types";
import { mockedTrackList } from "~/__mocks__/track.mock";

describe("PlaylistProvider", () => {
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
