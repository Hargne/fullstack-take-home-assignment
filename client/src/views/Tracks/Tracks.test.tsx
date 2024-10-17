import { fireEvent, render, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { mockedTrackList } from "~/__mocks__/track.mock";
import { MockedPlaylistContext, MockedTrackContext } from "~/testUtils";
import Tracks from "./Tracks";

expect.extend(toHaveNoViolations);

jest.mock("~/constants", () => ({
  API_URL: "http://mocked-url",
}));

describe("Tracks View", () => {
  it("should list all tracks and make it possible for the user to play and pause a track", async () => {
    const contextValues = {
      tracks: mockedTrackList,
      currentTrack: undefined,
      isPlaying: false,
      fetchTracks: jest.fn(),
      togglePlayback: jest.fn(),
    };
    const screen = render(
      <MockedTrackContext {...contextValues}>
        <Tracks />
      </MockedTrackContext>
    );
    const firstTrack = mockedTrackList[0];
    const secondTrack = mockedTrackList[1];

    // Look for any basic a11y issues
    const a11yResults = await axe(screen.container);
    expect(a11yResults).toHaveNoViolations();

    // Find the first and second track's play buttons
    const firstTrackPlayBtn = screen.getByRole("button", {
      name: `Play ${firstTrack.title}`,
    });
    expect(firstTrackPlayBtn).toBeInTheDocument();
    const secondTrackPlayBtn = screen.getByRole("button", {
      name: `Play ${secondTrack.title}`,
    });
    expect(secondTrackPlayBtn).toBeInTheDocument();

    // It should be possible to play and pause a single track
    await userEvent.click(firstTrackPlayBtn);
    await waitFor(() =>
      expect(firstTrackPlayBtn).toHaveAccessibleName("Pause track")
    );
    await userEvent.click(firstTrackPlayBtn);
    await waitFor(() =>
      expect(firstTrackPlayBtn).toHaveAccessibleName(`Play ${firstTrack.title}`)
    );

    // When the user clicks the play button of the second track when the first track is playing...
    await userEvent.click(firstTrackPlayBtn);
    await waitFor(() =>
      expect(firstTrackPlayBtn).toHaveAccessibleName("Pause track")
    );
    await userEvent.click(secondTrackPlayBtn);
    // ...it should start playing the second track and pause the first
    await waitFor(() =>
      expect(secondTrackPlayBtn).toHaveAccessibleName("Pause track")
    );
    await waitFor(() =>
      expect(firstTrackPlayBtn).toHaveAccessibleName(`Play ${firstTrack.title}`)
    );
  });

  it("should be possible to add and remove a track from a playlist", async () => {
    const playlistContextValues = {
      playlists: [
        {
          id: "1",
          title: "A Playlist",
          tracks: [],
        },
      ],
      createPlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      removeTrackFromPlaylist: jest.fn(),
    };
    const trackContextValues = {
      tracks: mockedTrackList,
      currentTrack: undefined,
      isPlaying: false,
      fetchTracks: jest.fn(),
      togglePlayback: jest.fn(),
    };

    const screen = render(
      <MockedPlaylistContext {...playlistContextValues}>
        <MockedTrackContext {...trackContextValues}>
          <Tracks />
        </MockedTrackContext>
      </MockedPlaylistContext>
    );

    const firstTrack = mockedTrackList[0];

    const trackRow = screen.getByRole("listitem", {
      name: `${firstTrack.title} by ${firstTrack.main_artists.join(", ")}`,
    });
    const toggleTrackActionsBtn = within(trackRow).getByRole("button", {
      name: "Toggle track actions",
    });

    // When the user clicks the toggle track actions button it should show the add to playlist option
    await userEvent.click(toggleTrackActionsBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("listitem", { name: "Add to playlist" })
      ).toBeInTheDocument();
    });

    // When the user hovers the add to playlist option it should show the available playlists
    await fireEvent.mouseOver(
      screen.getByRole("link", { name: "Add to playlist" })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: "Select playlist to add track to" })
      ).toBeInTheDocument();
    });

    // When the user clicks the add to playlist option it should add the track to the playlist
    const addToFirstPlaylistItem = screen.getByRole("listitem", {
      name: "Add to A Playlist",
    });
    expect(addToFirstPlaylistItem).toHaveAttribute("aria-selected", "false");
    await userEvent.click(within(addToFirstPlaylistItem).getByRole("link"));
    await waitFor(() =>
      expect(addToFirstPlaylistItem).toHaveAttribute("aria-selected", "true")
    );

    // When the user clicks the add to playlist option again it should remove the track from the playlist
    await userEvent.click(within(addToFirstPlaylistItem).getByRole("link"));
    await waitFor(() =>
      expect(addToFirstPlaylistItem).toHaveAttribute("aria-selected", "false")
    );
  });

  it("should be possible to create a new playlist and add a track to it", async () => {
    const playlistContextValues = {
      playlists: [],
      createPlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      removeTrackFromPlaylist: jest.fn(),
    };
    const trackContextValues = {
      tracks: mockedTrackList,
      currentTrack: undefined,
      isPlaying: false,
      fetchTracks: jest.fn(),
      togglePlayback: jest.fn(),
    };

    const screen = render(
      <MockedPlaylistContext {...playlistContextValues}>
        <MockedTrackContext {...trackContextValues}>
          <Tracks />
        </MockedTrackContext>
      </MockedPlaylistContext>
    );

    const firstTrack = mockedTrackList[0];

    const trackRow = screen.getByRole("listitem", {
      name: `${firstTrack.title} by ${firstTrack.main_artists.join(", ")}`,
    });
    const toggleTrackActionsBtn = within(trackRow).getByRole("button", {
      name: "Toggle track actions",
    });

    // When the user clicks the toggle track actions button it should show the add to playlist option
    await userEvent.click(toggleTrackActionsBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("listitem", { name: "Add to playlist" })
      ).toBeInTheDocument();
    });

    // When the user hovers the add to playlist option it should show the available playlists
    await fireEvent.mouseOver(
      screen.getByRole("link", { name: "Add to playlist" })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: "Select playlist to add track to" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("link", { name: "New playlist" }));

    // Enter a playlist name
    await userEvent.click(
      screen.getByRole("textbox", { name: "Playlist name" })
    );
    await userEvent.keyboard("Some playlist name");
    // Click the create playlist button
    await userEvent.click(
      screen.getByRole("button", { name: "Create playlist" })
    );
    // The new playlist should be created and the track should be added to it
    await waitFor(() => {
      expect(
        screen.getByRole("listitem", { name: "Add to Some playlist name" })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("listitem", { name: "Add to Some playlist name" })
    ).toHaveAttribute("aria-selected", "true");
  });
});
