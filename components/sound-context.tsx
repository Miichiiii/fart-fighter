"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type SoundContextType = {
  isMuted: boolean;
  toggleMute: () => void;
  setCurrentTrack: (track: string) => void;
};

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleMute: () => {},
  setCurrentTrack: () => {},
});

export const useSoundContext = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrackState] =
    useState<string>("/Der Furzsong.mp3");

  useEffect(() => {
    // Create audio element with initial track
    const audioElement = new Audio("/Der Furzsong.mp3");
    audioElement.loop = true;
    audioElement.volume = 0.5;
    setAudio(audioElement);

    // Try to play immediately
    const tryPlay = () => {
      if (!isMuted) {
        audioElement.play().catch(() => {
          // Auto-play prevented, will play after user interaction
        });
      }
    };

    // Try to play on any user interaction
    const playOnInteraction = () => {
      tryPlay();
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
    };

    document.addEventListener("click", playOnInteraction);
    document.addEventListener("keydown", playOnInteraction);

    // Try to play immediately (might work if user already interacted)
    tryPlay();

    // Clean up on unmount
    return () => {
      audioElement.pause();
      audioElement.src = "";
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
    };
  }, []);

  useEffect(() => {
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      // Only play if the document has been interacted with
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented, we'll need user interaction
          console.log("Audio playback was prevented:", error);
        });
      }
    }
  }, [audio, isMuted]);

  // Handle track changes
  useEffect(() => {
    if (!audio || !currentTrack) return;

    // Stop current audio
    audio.pause();
    audio.currentTime = 0;

    // Set new track
    audio.src = currentTrack;
    audio.load();

    // Play if not muted
    if (!isMuted) {
      audio.play().catch((error) => {
        console.log("Audio playback was prevented:", error);
      });
    }
  }, [currentTrack, audio, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setCurrentTrack = (track: string) => {
    setCurrentTrackState(track);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setCurrentTrack }}>
      {children}
    </SoundContext.Provider>
  );
}
