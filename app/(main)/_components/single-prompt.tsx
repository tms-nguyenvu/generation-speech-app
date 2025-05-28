import { Textarea } from "@/components/ui/textarea";

export default function SinglePrompt() {
  return (
    <div className="border border-slate-200 rounded-md h-4/5">
      <Textarea name="text" className="h-full" placeholder="Read aloud with a dramatic flair: It was a dark and stormy night..." />
    </div>
  );
}
