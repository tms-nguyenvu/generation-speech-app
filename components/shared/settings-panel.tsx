import { ListRestart, UserRound, UsersRound } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";

export default function SettingsPanel() {
  return <>
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
    <div>
      <Label>Model</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Models</SelectLabel>
            <SelectItem value="apple">Gemini 2.5 Flash Preview TTS</SelectItem>
            <SelectItem value="banana">Gemini 2.5 Pro Preview TTS</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <RadioGroup defaultValue="comfortable" className="border-b border-slate-200 py-4 space-y-2">
      <Label>Mode</Label>
      <div className="flex items-center justify-between gap-4">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1" className="flex items-center gap-2"><UserRound className="size-4" />
          <Link href="/single-speaker">Single-speaker audio</Link>
        </Label>
      </div>
      <div className="flex items-center justify-between gap-4">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2" className="flex items-center gap-2"><UsersRound className="size-4" />
          <Link href="/multi-speaker">Multi-speaker audio</Link>
        </Label>
      </div>
    </RadioGroup>

    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Model settings</AccordionTrigger>
        <AccordionContent>
          <Label>Temperature</Label>
          <div className="flex justify-between gap-4">
            <Slider
              defaultValue={[1]}
              max={2}
              step={0.25}
              className={"w-full"}
            />
            <Input className="size-10 mr-2" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </>;
}
