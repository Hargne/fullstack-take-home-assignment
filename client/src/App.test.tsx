import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "./App";
import { mockedPlaylist } from "./__mocks__/playlist.mock";
import { mockedTrackList } from "./__mocks__/track.mock";
import { MockedPlaylistContext, MockedTrackContext } from "./testUtils";

expect.extend(toHaveNoViolations);

describe("App", () => {
  const renderScreen = () => {
    const playlistContext = {
      playlists: mockedPlaylist,
      createPlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      removeTrackFromPlaylist: jest.fn(),
    };

    const trackContext = {
      tracks: mockedTrackList,
      currentTrack: undefined,
      isPlaying: false,
      fetchTracks: jest.fn(),
      togglePlayback: jest.fn(),
    };

    return render(
      <MockedPlaylistContext {...playlistContext}>
        <MockedTrackContext {...trackContext}>
          <App />
        </MockedTrackContext>
      </MockedPlaylistContext>
    );
  };

  it("should render the app without any a11y issues", async () => {
    const screen = renderScreen();

    // Look for any basic a11y issues
    const a11yResults = await axe(screen.container);
    expect(a11yResults).toHaveNoViolations();

    expect(screen.getByRole("tab", { name: "Tracks" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("should be possible to change to the playlist view", async () => {
    const screen = renderScreen();
    const tracksTab = screen.getByRole("tab", { name: "Tracks" });
    const playlistTab = screen.getByRole("tab", { name: "Playlists" });

    // Ensure the Tracks tab is selected by default
    expect(tracksTab).toHaveAttribute("aria-selected", "true");
    expect(playlistTab).toHaveAttribute("aria-selected", "false");
    // When the Playlist tab is clicked, it should become selected
    await userEvent.click(playlistTab);
    expect(tracksTab).toHaveAttribute("aria-selected", "false");
    expect(playlistTab).toHaveAttribute("aria-selected", "true");
  });
});
