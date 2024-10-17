import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TrackProps } from "~/@types";
import { GetTracksResponse, TrackContextProps } from "./TrackProvider.types";
import AudioPlayer from "~/components/AudioPlayer/AudioPlayer";

export const TrackContext = createContext<TrackContextProps>(
  {} as TrackContextProps
);

export function TrackProvider({ children }: Readonly<PropsWithChildren<{}>>) {
  const [tracks, setTracks] = useState<Array<TrackProps>>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackProps>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function fetchTracks() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tracks/`, {
      mode: "cors",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }
    const data = (await response.json()) as GetTracksResponse;
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response");
    }
    setTracks(data);
  }

  function togglePlayback(trackToPlay?: TrackProps) {
    try {
      if (trackToPlay && trackToPlay !== currentTrack) {
        setCurrentTrack(trackToPlay);
        return;
      }

      if (!audioRef.current) {
        return;
      }
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Failed to play track", error);
    }
  }

  function setPlaybackPosition(progress: number) {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = progress * audioRef.current.duration;
  }

  function onPlaybackProgressUpdate(e: Event) {
    const audioElement = e.target as HTMLAudioElement;
    if (!audioElement.duration || !audioElement.currentTime) {
      return;
    }
    setPlaybackProgress(audioElement.currentTime / audioElement.duration);
  }

  useEffect(() => {
    fetchTracks();
  }, []);

  // When the current track changes, set up listeners for the audio element
  useEffect(() => {
    if (!currentTrack || !audioRef.current) {
      return;
    }
    if (audioRef.current) {
      audioRef.current.addEventListener("play", () => setIsPlaying(true));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("timeupdate", onPlaybackProgressUpdate);
      audioRef.current.play();
      audioRef.current.currentTime = 0;
    }
  }, [currentTrack]);

  const value = useMemo(
    () => ({
      tracks,
      currentTrack,
      fetchTracks,
      togglePlayback,
      isPlaying,
    }),
    [tracks, currentTrack, isPlaying]
  );

  return (
    <TrackContext.Provider value={value}>
      {children}

      {currentTrack && (
        <>
          <audio src={currentTrack.audio} ref={audioRef} />
          <AudioPlayer
            track={currentTrack}
            onTogglePlayback={togglePlayback}
            isPlaying={isPlaying}
            playbackProgress={playbackProgress}
            onSetPlaybackPosition={setPlaybackPosition}
          />
        </>
      )}
    </TrackContext.Provider>
  );
}
