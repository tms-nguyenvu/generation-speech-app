"use server";

import wav from "wav";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { Writable } from "stream";


function parseMimeType(mime: string | undefined) {
  const bitDepth = mime?.includes("L16") ? 16 : 8;
  const rateMatch = mime?.match(/rate=(\d+)/);
  const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 16000;
  const channelMatch = mime?.match(/channels=(\d+)/);
  const channels = channelMatch ? parseInt(channelMatch[1]) : 1;
  return { bitDepth, sampleRate, channels };
}

async function pcmToWavWithLib(
  pcmBuffer: Buffer,
  options?: { channels?: number; sampleRate?: number; bitDepth?: number }
): Promise<Buffer> {
  const channels = options?.channels ?? 1;
  const sampleRate = options?.sampleRate ?? 16000;
  const bitDepth = options?.bitDepth ?? 16;

  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate,
      bitDepth,
    });

    const chunks: Buffer[] = [];

    const writable = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    writer.on("error", reject);
    writable.on("error", reject);
    writable.on("finish", () => {
      resolve(Buffer.concat(chunks));
    });

    writer.pipe(writable);
    writer.write(pcmBuffer);
    writer.end();
  });
}

const singleSpeechFormData = z.object({
  model: z.string(),
  text: z.string(),
  voice: z.string(),
});

export async function generateSingleSpeech(_: unknown, formData: FormData) {
  try {
    const rawData = {
      model: formData.get("model"),
      text: formData.get("text"),
      voice: formData.get("voice"),
    };

    const { model, text, voice } = singleSpeechFormData.parse(rawData);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    const data = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!data) {
      throw new Error("No audio data returned from API.");
    }

    const { channels, sampleRate, bitDepth } = parseMimeType(mimeType);
    const pcmBuffer = Buffer.from(data, "base64");

    const wavBuffer = await pcmToWavWithLib(pcmBuffer, {
      channels,
      sampleRate,
      bitDepth,
    });

    const wavBase64 = wavBuffer.toString("base64");

    return {
      success: true,
      audioData: wavBase64,
    };
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return {
      success: false,
      error: "Failed to generate speech",
    };
  }
}

const multiSpeechFormData = z.object({
  prompt: z.string(),
  instructions: z.string(),
  model: z.string(),
  name: z.union([z.string(), z.array(z.string())]),
  voice: z.union([z.string(), z.array(z.string())]),
});

export async function generateMultiSpeech(_: unknown, formData: FormData) {
  try {
    const names = formData.getAll("name").map((v) => v.toString());
    const voices = formData.getAll("voice").map((v) => v.toString());

    const rawData = {
      prompt: formData.get("prompt"),
      instructions: formData.get("instructions"),
      model: formData.get("model"),
      name: names,
      voice: voices,
    };

    const parsed = multiSpeechFormData.parse(rawData);
    const fullPrompt = `${parsed.instructions}\n${parsed.prompt}`;

    if (names.length !== voices.length) {
      throw new Error("Each speaker must have a corresponding voice");
    }

    const speakerVoiceConfigs = names.map((name, index) => ({
      speaker: name,
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: voices[index] },
      },
    }));

    const payload = {
      model: parsed.model,
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs,
          },
        },
      },
    };

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent(payload as any);
    const part = response.candidates?.[0]?.content?.parts?.[0];
    const data = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!data) {
      throw new Error("No audio data returned from API.");
    }

    const { channels, sampleRate, bitDepth } = parseMimeType(mimeType);
    const pcmBuffer = Buffer.from(data, "base64");

    const wavBuffer = await pcmToWavWithLib(pcmBuffer, {
      channels,
      sampleRate,
      bitDepth,
    });

    const wavBase64 = wavBuffer.toString("base64");

    return {
      success: true,
      audioData: wavBase64,
    };
  } catch (error) {
    console.error("Multi TTS Generation Error:", error);
    return {
      success: false,
      error: "Failed to generate multi-speaker speech",
    };
  }
}
