import { Time } from "@/components/ui/time-picker";
import { FileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ColorPicker, {
  existingColors,
} from "@/components/routes/create/color-picker";
import NameInput from "@/components/routes/create/name-input";
import TimePicker from "@/components/routes/create/time-picker";
import SoundUpload from "@/components/routes/create/sound-upload";
import SoundVolume from "@/components/routes/create/sound-volume";
import IntervalSwitch from "@/components/routes/create/interval-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { get, set } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";
import { Timer } from "@/types/core";

export const Route = new FileRoute('/create/').createRoute({
  component: CreateTimer,
});

const isTimeEmpty = (time: Time | undefined) => {
  return (
    !time || (time.hours === 0 && time.minutes === 0 && time.seconds === 0)
  );
};

function CreateTimer() {
  const [name, setName] = useState<string>("");
  const [time, setTime] = useState<Time | undefined>(undefined);
  const [color, setColor] = useState<string>(existingColors[0]);
  const [volume, setVolume] = useState<number>(1);
  const [isInterval, setIsInterval] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const createTimer = async () => {
    if (!name) {
      return toast.error("Please enter a name.");
    }

    if (isTimeEmpty(time) || !time) {
      return toast.error("Please pick time.");
    }

    if (!file) {
      return toast.error("Please upload a sound file.");
    }

    const existingTimers = await get("timers");

    const newTimer: Timer = {
      id: uuidv4(),
      name,
      time,
      color,
      volume,
      isInterval,
      file,
    };

    await set("timers", [...(existingTimers || []), newTimer]);

    toast.success("Create timer successfully!");

    navigate({ to: "/$timerId", params: { timerId: newTimer.id } });
  };

  return (
    <div className="py-20 min-h-[inherit] flex flex-col justify-center w-full space-y-8">
      <h1 className="text-4xl font-semibold">Add timer</h1>

      <div>
        <NameInput name={name} onNameChange={setName} />
      </div>

      <div>
        <TimePicker
          selected={time}
          onChange={(time) => {
            setTime(time);
          }}
        />
      </div>

      <div>
        <ColorPicker color={color} onChange={setColor} />
      </div>

      <div>
        <SoundUpload file={file} onChange={setFile} />
      </div>

      <div>
        <SoundVolume volume={volume} onChange={setVolume} />
      </div>

      <div>
        <IntervalSwitch isInterval={isInterval} onChange={setIsInterval} />
      </div>

      <Button onClick={createTimer}>
        <p className="font-semibold text-base">Create</p>
      </Button>
    </div>
  );
}
