import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CirclePlay } from "lucide-react";
import { VOICE_OPTIONS } from "@/app/constants/voice-options";

export default function SingleVoice() {
  return (
    <div>
      <Label>Voice</Label>
      <Select name="voice" defaultValue="Zephyr">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Voices</SelectLabel>
            {VOICE_OPTIONS.map((voice) => (
              <SelectItem key={voice.id} value={voice.name}>
                <div className="flex items-center gap-4">
                  <CirclePlay className="size-4 flex-shrink-0 text-slate-600" />
                  <div className="flex flex-col">
                    <strong className="text-sm font-medium">{voice.name}</strong>
                    <span className="text-xs text-slate-500">{voice.style}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
