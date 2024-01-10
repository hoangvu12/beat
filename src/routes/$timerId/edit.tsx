import IntervalSwitch from "@/components/routes/create/interval-switch";
import NameInput from "@/components/routes/create/name-input";
import SoundUpload from "@/components/routes/create/sound-upload";
import SoundVolume from "@/components/routes/create/sound-volume";
import TimePicker from "@/components/routes/create/time-picker";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/routes/create/color-picker";
import { Time } from "@/components/ui/time-picker";
import { timerQueryOptions } from "@/queries/timer";
import { Timer } from "@/types/core";
import { FileRoute, Link, useNavigate } from "@tanstack/react-router";
import { get, set } from "idb-keyval";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = new FileRoute("/$timerId/edit").createRoute({
  component: EditTimersComponent,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      timerQueryOptions(params.timerId)
    );

    if (!data) throw new Error("Timer not found");

    return data;
  },
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[inherit]">
      <p className="text-6xl font-semibold">Timer not found</p>

      <Link to="/">
        <Button className="mt-8">
          <p className="text-xl font-semibold">Go back</p>
        </Button>
      </Link>
    </div>
  ),
});

const isTimeEmpty = (time: Time | undefined) => {
  return (
    !time || (time.hours === 0 && time.minutes === 0 && time.seconds === 0)
  );
};

function EditTimersComponent() {
  const timer = Route.useLoaderData()!;

  const [name, setName] = useState<string>(timer.name);
  const [time, setTime] = useState<Time | undefined>(timer.time);
  const [color, setColor] = useState<string>(timer.color);
  const [volume, setVolume] = useState<number>(timer.volume);
  const [isInterval, setIsInterval] = useState<boolean>(timer.isInterval);
  const [file, setFile] = useState<File | null>(timer.file);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const editTimer = async () => {
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
    const existingTimer = existingTimers.find(
      (existingTimer: Timer) => existingTimer.id === existingTimer.id
    );

    if (!existingTimer) {
      return toast.error("Timer not found.");
    }

    existingTimer.name = name;
    existingTimer.time = time;
    existingTimer.color = color;
    existingTimer.volume = volume;
    existingTimer.isInterval = isInterval;
    existingTimer.file = file;

    await set("timers", existingTimers);

    queryClient.invalidateQueries(timerQueryOptions(existingTimer.id));

    toast.success("Edit timer successfully!");

    navigate({ to: "/$timerId", params: { timerId: existingTimer.id } });
  };

  return (
    <div className="py-20 min-h-[inherit] flex flex-col justify-center w-full space-y-8">
      <h1 className="text-4xl font-semibold">Edit timer</h1>

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

      <Button onClick={editTimer}>
        <p className="font-semibold text-base">Edit</p>
      </Button>
    </div>
  );
}
