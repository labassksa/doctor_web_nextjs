"use client";
import React, { useState, useRef, useEffect } from "react";

interface VoiceNoteProps {
  audioUrl: string; // URL to the voice note
  recordedTime: string; // Time in seconds of the recording
}

const VoiceNotePlayer: React.FC<VoiceNoteProps> = ({
  audioUrl,
  recordedTime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle end of audio to reset play state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }
  }, []);

  // Log the recordedTime whenever it updates
  useEffect(() => {
    console.log("Recorded time updated:", recordedTime);
  }, [recordedTime]); // Watch for recordedTime changes

  // Format time (seconds) to mm:ss
  const formatTime = (time: string) => {
    const parsedTime = parseFloat(time);
    console.log(`parsedTime in the player : ${parsedTime}`);
    const minutes = Math.floor(parsedTime / 60);
    const seconds = Math.round(parsedTime % 60); // Rounding to avoid very small values being lost
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="voice-note-player flex items-center space-x-2">
      <button
        className="play-pause-btn p-2 m-2 bg-gray-200 rounded-full"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 9V15M14 9V15"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-6.496-3.757A1 1 0 007 8.757v6.486a1 1 0 001.256.962l6.496-1.757A1 1 0 0015 13.486v-1.486a1 1 0 00-.248-.664z"
            />
          </svg>
        )}
      </button>

      <span className="text-gray-400 m-2">{formatTime(recordedTime)}</span>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default VoiceNotePlayer;
