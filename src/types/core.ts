import { Time } from "@/components/ui/time-picker";

export interface Timer {
  id: string;
  name: string;
  time: Time;
  color: string;
  volume: number;
  isInterval: boolean;
  // Backwards compatibility
  file: File | string;
  soundFile: SoundFile;
}

export interface SoundFile {
  id: string;
  name: string;
  file: File | string;
}
