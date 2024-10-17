import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { mockedPlaylist } from "~/__mocks__/playlist.mock";
import { MockedPlaylistContext } from "~/testUtils";
import Playlists from "./Playlists";

expect.extend(toHaveNoViolations);

jest.mock("~/constants", () => ({
  API_URL: "http://mocked-url",
}));

describe("Playlists View", () => {
  it("should list all playlists and their tracks", async () => {
    const playlistContextValues = {
      playlists: mockedPlaylist,
      createPlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      removeTrackFromPlaylist: jest.fn(),
    };

    const screen = render(
      <MockedPlaylistContext {...playlistContextValues}>
        <Playlists />
      </MockedPlaylistContext>
    );

    // Look for any basic a11y issues
    const a11yResults = await axe(screen.container);
    expect(a11yResults).toHaveNoViolations();

    // Open the first playlist and make sure that there are no tracks
    const firstPlaylist = screen.getByRole("listitem", {
      name: "First playlist",
    });
    expect(firstPlaylist).toBeInTheDocument();
    await userEvent.click(
      within(firstPlaylist).getByRole("button", { name: "Toggle playlist" })
    );
    expect(screen.getByText("This playlist is empty")).toBeInTheDocument();

    // Open the second playlist and make sure that there are tracks
    const secondPlaylist = screen.getByRole("listitem", {
      name: "Second playlist",
    });
    expect(secondPlaylist).toBeInTheDocument();
    await userEvent.click(
      within(secondPlaylist).getByRole("button", { name: "Toggle playlist" })
    );
    expect(screen.getByText("Test Track")).toBeInTheDocument();
  });

  it("should be possible to delete a playlist", async () => {
    const playlistContextValues = {
      playlists: [mockedPlaylist[0]],
      createPlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      removeTrackFromPlaylist: jest.fn(),
    };

    const screen = render(
      <MockedPlaylistContext {...playlistContextValues}>
        <Playlists />
      </MockedPlaylistContext>
    );

    const firstPlaylist = screen.getByRole("listitem", {
      name: "First playlist",
    });
    expect(firstPlaylist).toBeInTheDocument();
    await userEvent.click(
      within(firstPlaylist).getByRole("button", { name: "Toggle playlist" })
    );
    const deleteBtn = within(firstPlaylist).getByRole("button", {
      name: "Delete playlist",
    });
    expect(deleteBtn).toBeInTheDocument();
    await userEvent.click(deleteBtn);
    expect(firstPlaylist).not.toBeInTheDocument();

    expect(screen.getByText("You have no playlists yet")).toBeInTheDocument();
  });
});
