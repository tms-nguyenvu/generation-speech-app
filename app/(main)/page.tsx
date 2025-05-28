"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CornerDownLeft, ImagePlay, ListRestart, UserRound, UsersRound } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { generateSingleSpeech, generateMultiSpeech } from "./action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SinglePrompt from "./_components/single-prompt";
import MultiPrompt from "./_components/multi-prompt";
import SingleVoice from "./_components/single-voice";
import MultiVoice from "./_components/multi-voice";
import Form from "next/form";
import LoadingButton from "@/components/shared/loading-button";

export default function Home() {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [singleSpeechState, singleSpeechFormAction, singleSpeechProgress] = useActionState(generateSingleSpeech, null);
  const [multiSpeechState, multiSpeechFormAction, multiSpeechProgress] = useActionState(generateMultiSpeech, null);


  useEffect(() => {
    if (mode === 'single') {
      if (singleSpeechState?.success && singleSpeechState.audioData) {
        toast.success("Speech generated successfully!");
        setAudioUrl(`data:audio/wav;base64,${singleSpeechState.audioData}`);
      } else if (singleSpeechState?.error) {
        toast.error(singleSpeechState.error);
        setAudioUrl(null);
      }
    } else if (mode === 'multi') {
      if (multiSpeechState?.success && multiSpeechState.audioData) {
        toast.success("Speech generated successfully!");
        setAudioUrl(`data:audio/wav;base64,${multiSpeechState.audioData}`);
      } else if (multiSpeechState?.error) {
        toast.error(multiSpeechState.error);
        setAudioUrl(null);
      }
    }
  }, [singleSpeechState, multiSpeechState, mode]);



  return (
    <div className="flex items-center rounded-md bg-white h-full">
      <Form action={mode === "single" ? singleSpeechFormAction : multiSpeechFormAction}
        className="flex justify-between gap-2 w-full bg-slate-100 h-full">
        <div className="rounded-md bg-white p-4 w-3/5">
          <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-center gap-2 py-2 border-b border-slate-200">
              <ImagePlay className="size-6" />
              <h1 className="text-md font-medium">Generate Media {">"} Generate speech</h1>
            </div>
            {mode === "single" ? <SinglePrompt /> : <MultiPrompt />}
            {audioUrl && (
              <div className="w-full">
                <audio controls className="w-full" src={audioUrl} />
              </div>
            )}

            <LoadingButton type="submit"
              isLoading={singleSpeechProgress || multiSpeechProgress}
              loadingText="Generating..."
              className="max-w-[120px] transition-all duration-200 hover:scale-102">
              <div className="flex items-center gap-2">
                <span>Run</span>
                <span className="flex items-center font-bold">Ctrl <CornerDownLeft className="size-4" /></span>
              </div>
            </LoadingButton>
          </div>
        </div>
        <div className="rounded-md bg-white p-4 w-2/5">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <h1 className="text-md font-medium">Run settings</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ListRestart className="size-6 hover:text-slate-600 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset default settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="border-b border-slate-200 py-4 space-y-2">
              <Label>Mode</Label>
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full flex-1 cursor-pointer flex items-center gap-2 justify-start",
                    mode === 'single' && "border-primary text-primary"
                  )}
                  onClick={() => setMode('single')}
                >
                  <UserRound className="size-4" />
                  Single-speaker audio
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full flex-1 cursor-pointer flex items-center gap-2 justify-start",
                    mode === 'multi' && "border-primary text-primary"
                  )}
                  onClick={() => setMode('multi')}
                >
                  <UsersRound className="size-4" />
                  Multi-speaker audio
                </Button>
              </div>
            </div>

            <div>
              <Label>Model</Label>
              <Select name="model" defaultValue="gemini-2.5-flash-preview-tts" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Models</SelectLabel>
                    <SelectItem value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash Preview TTS</SelectItem>
                    <SelectItem value="gemini-2.5-pro-preview-tts">Gemini 2.5 Pro Preview TTS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {mode === "single" ? <SingleVoice /> : <MultiVoice />}
          </div>
        </div>
      </Form>
    </div>
  );
}
