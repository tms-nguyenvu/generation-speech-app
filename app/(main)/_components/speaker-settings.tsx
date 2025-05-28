import { VOICE_OPTIONS } from "@/app/constants/voice-options";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CirclePlay } from "lucide-react";

interface Speaker {
  id: string;
  speakerId: string;
  name: string;
  voice: string;
  color: string;
}

interface SpeakerSettingsProps {
  speaker: Speaker;
  onUpdate: (data: Partial<Speaker>) => void;
}

export function SpeakerSettings({ speaker, onUpdate }: SpeakerSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={`name-${speaker.id}`} className="text-xs font-normal text-slate-600">
          Name
        </Label>
        <Input
          type="text"
          id={`name-${speaker.id}`}
          placeholder="Enter name speaker"
          value={speaker.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
        />
      </div>
      <div>
        <Label className="text-xs font-normal text-slate-600">Voice</Label>
        <Select
          value={speaker.voice}
          onValueChange={(value) => onUpdate({ voice: value })}
        >
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
    </div>
  );
}
