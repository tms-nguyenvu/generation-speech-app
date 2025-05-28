"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  AlertCircle,
} from "lucide-react";


interface AudioPlayerProps {
  audioUrl: string | null;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    // Reset states when audio source changes
    setIsPlaying(false);
    setProgress(0);
    setError(null);

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setError('Failed to load audio. Please try again.');
      setIsPlaying(false);
    };

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(value);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    // Add event listeners
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    // Clean up
    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
        setError(null);
      } catch (err) {
        console.error('Playback error:', err);
        setError('Failed to play audio. Please try again.');
        setIsPlaying(false);
      }
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setError(null);
    }
  };

  if (!audioUrl) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          onCanPlayThrough={() => setError(null)}
        />
        <div className="space-y-4">
          {/* {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleReset}
              disabled={!!error}
            >
              <RewindIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handlePlay}
              disabled={!!error}
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
