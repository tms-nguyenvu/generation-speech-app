import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { SpeakerSettings } from "./speaker-settings";
import useMultiSpeechStore from "@/app/stores/multi-speech-store";
import { Fragment } from "react";

export default function MultiVoice() {
  const { speakers, updateSpeaker } = useMultiSpeechStore();

  const defaultSpeakers = speakers
    .filter((speaker, index, self) =>
      (speaker.speakerId === '1' || speaker.speakerId === '2') &&
      self.findIndex((s) => s.speakerId === speaker.speakerId) === index
    );

  return (
    <div>
      <Label>Voice settings</Label>
      {defaultSpeakers.map((speaker) => (
        <Fragment key={`hidden-${speaker.speakerId}`}>
          <input type="hidden" name={`name`} value={speaker.name} />
          <input type="hidden" name={`voice`} value={speaker.voice || ''} />
        </Fragment>
      ))}
      <Accordion className="space-y-4" type="single" collapsible>
        {defaultSpeakers.map((speaker) => (
          <AccordionItem key={speaker.id} value={`item-${speaker.id}`}>
            <AccordionTrigger className="rounded-md bg-slate-100 p-2">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${speaker.color}`} />
                <span>{speaker.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 mt-2">
              <SpeakerSettings
                speaker={speaker}
                onUpdate={(data) => updateSpeaker(speaker.id, data)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
