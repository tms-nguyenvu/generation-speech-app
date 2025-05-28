import useMultiSpeechStore from "@/app/stores/multi-speech-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Blocks, FileCode2, Plus, Trash } from "lucide-react";
import { Fragment } from "react";

export default function MultiPrompt() {
  const { speakers, updateSpeaker, deleteSpeaker, addDialog } = useMultiSpeechStore();

  return (
    <div className="border rounded-md flex h-full">
      <div className="flex flex-col p-4 border-r space-y-4 w-1/2">
        <div className="flex items-center gap-2">
          <FileCode2 className="size-4" />
          <span className="text-sm font-semibold">Raw structure</span>
        </div>
        <p className="text-xs text-slate-600">The below reflects how to structure your script in your API request.</p>
        <Textarea
          className="bg-slate-100 h-full rounded-md"
          name="prompt"
          value={speakers
            .filter((s) => s.dialog && s.dialog.trim() !== '')
            .sort((a, b) => {
              const [aSpeakerId, aIndex] = a.id.split('-').map(Number);
              const [bSpeakerId, bIndex] = b.id.split('-').map(Number);
              return aIndex - bIndex || aSpeakerId - bSpeakerId;
            })
            .map((s) => `${s.name}: ${s.dialog}`)
            .join('\n')}
          readOnly
        />
      </div>
      <div className="flex flex-col p-4 space-y-4 w-1/2">
        <div className="flex items-center gap-2">
          <Blocks className="size-4" />
          <span className="text-sm font-semibold">Script builder</span>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="instructions" className="text-xs font-normal text-slate-600">
            Style instructions
          </Label>
          <Input type="text" id="instructions" name="instructions" placeholder="Enter style instructions" />
        </div>
        <div className="space-y-2">
          {speakers.map((speaker) => (
            <Fragment key={speaker.id}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className={`bg-yellow-100 p-2 rounded-full max-w-24 flex items-center justify-center gap-2 truncate`}>
                    <span className={`size-2 rounded-full ${speaker.color}`} />
                    <span className="text-sm font-medium">{speaker.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteSpeaker(speaker.id)}
                  >
                    <Trash className="size-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="Start typing dialog here..."
                  className="border-none outline-none bg-slate-100 rounded-full focus-visible:ring-0"
                  value={speaker.dialog || ''}
                  onChange={(e) => updateSpeaker(speaker.id, { dialog: e.target.value })}
                />
              </div>
            </Fragment>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addDialog}>
          <Plus className="size-4" />
          Add Dialog
        </Button>
      </div>
    </div>
  );
}
