// TrackProvider.test.tsx
import { useContext } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { TrackProvider, TrackContext } from "./TrackProvider";
import { mockedTrackList } from "~/__mocks__/track.mock";

jest.mock("~/constants", () => ({
  API_URL: "http://mocked-url",
}));

describe("TrackProvider", () => {
  const unmockedFetch = global.fetch;
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedTrackList),
      })
    ) as jest.Mock;
    jest
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(window.HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  const TestComponent = () => {
    const { tracks, togglePlayback, currentTrack, isPlaying } =
      useContext(TrackContext);

    return (
      <div>
        <p data-testid="currentTrack">
          {currentTrack ? currentTrack.title : "No Track"}
        </p>
        <button onClick={() => togglePlayback(tracks[0])}>Play Track 1</button>
        <button onClick={() => togglePlayback(tracks[1])}>Play Track 2</button>
        <p>{isPlaying ? "Playing" : "Paused"}</p>
      </div>
    );
  };

  test("fetches and displays tracks, toggles playback", async () => {
    render(
      <TrackProvider>
        <TestComponent />
      </TrackProvider>
    );

    // Verify tracks are fetched
    await waitFor(() =>
      expect(screen.getByText("Play Track 1")).toBeInTheDocument()
    );

    // Initially no track is playing
    expect(screen.getByTestId("currentTrack").textContent).toBe("No Track");
    expect(screen.getByText("Paused")).toBeInTheDocument();

    // Simulate playing Track 1
    await userEvent.click(screen.getByText("Play Track 1"));
    expect(screen.getByTestId("currentTrack").textContent).toBe(
      mockedTrackList[0].title
    );

    // Simulate playing Track 2
    await userEvent.click(screen.getByText("Play Track 2"));
    expect(screen.getByTestId("currentTrack").textContent).toBe(
      mockedTrackList[1].title
    );
  });
});
