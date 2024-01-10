import { Time } from "@/components/ui/time-picker";

export interface Timer {
  id: string;
  name: string;
  time: Time;
  color: string;
  volume: number;
  isInterval: boolean;
  file: File;
}
