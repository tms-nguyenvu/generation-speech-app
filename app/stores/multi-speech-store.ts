import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Speaker {
  id: string;
  speakerId: string;
  name: string;
  voice: string;
  color: string;
  dialog?: string;
}

interface State {
  speakers: Speaker[];
  setSpeakers: (speakers: Speaker[]) => void;
  updateSpeaker: (id: string, data: Partial<Speaker>) => void;
  deleteSpeaker: (id: string) => void;
  addDialog: () => void;
}

const useMultiSpeechStore = create<State>()(
  persist(
    (set) => ({
      speakers: [
        { id: '1-0', speakerId: '1', name: 'Speaker 1', voice: 'Zephyr', color: 'bg-yellow-400', dialog: '' },
        { id: '2-0', speakerId: '2', name: 'Speaker 2', voice: 'Kore', color: 'bg-blue-400', dialog: '' },
      ],
      setSpeakers: (speakers) => set({ speakers }),
      updateSpeaker: (id, data) => set((state) => {
        const targetSpeaker = state.speakers.find((speaker) => speaker.id === id);
        if (!targetSpeaker) return state;
        const targetSpeakerId = targetSpeaker.speakerId;
        return {
          speakers: state.speakers.map((speaker) =>
            data.name
              ? speaker.speakerId === targetSpeakerId
                ? { ...speaker, ...data }
                : speaker
              : speaker.id === id
                ? { ...speaker, ...data }
                : speaker
          ),
        };
      }),
      deleteSpeaker: (id) => set((state) => ({
        speakers: state.speakers.filter((speaker) => speaker.id !== id),
      })),
      addDialog: () => set((state) => {
        const existingIds = state.speakers.map((s) => s.id);
        const nextSpeakerId = state.speakers.length % 2 === 0 ? '1' : '2';
        const speakerToAdd = state.speakers.find((s) => s.speakerId === nextSpeakerId);
        if (!speakerToAdd) return state;

        const speakerDialogCount = state.speakers.filter((s) => s.speakerId === nextSpeakerId).length;
        let newDialogId = `${nextSpeakerId}-${speakerDialogCount}`;

        let suffix = 0;
        while (existingIds.includes(newDialogId)) {
          newDialogId = `${nextSpeakerId}-${speakerDialogCount}-${suffix}`;
          suffix++;
        }

        return {
          speakers: [
            ...state.speakers,
            { ...speakerToAdd, id: newDialogId, dialog: '' },
          ],
        };
      }),
    }),
    {
      name: 'multi-speech-storage',
    }
  )
);

export default useMultiSpeechStore;
