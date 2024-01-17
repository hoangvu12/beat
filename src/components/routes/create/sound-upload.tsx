import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import soundFilesOptions from "@/queries/sound-files";
import { SoundFile } from "@/types/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import {
  Loader2Icon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import AddSound from "./add-sound";

const defaultSound = new URL("@/assets/default-alarm.m4a", import.meta.url)
  .href;

interface SoundUploadProps {
  onChange?: (file: SoundFile) => void;
  soundFile: SoundFile | null;
}

const defaultSoundFile: SoundFile = {
  id: "default",
  name: "Default notification sound",
  file: defaultSound,
};

const SoundUpload: React.FC<SoundUploadProps> = ({ soundFile, onChange }) => {
  const { data, isLoading } = useQuery(soundFilesOptions);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const isSoundFileExists = (file: SoundFile | null) => {
    return file && data?.some((soundFile) => soundFile.id === file.id);
  };

  return (
    <React.Fragment>
      <Label htmlFor="sound-upload" className="block text-base mb-1">
        Notification sound
      </Label>

      <div className="flex items-center gap-2">
        <Select
          value={isSoundFileExists(soundFile) ? soundFile?.id : "default"}
          onValueChange={(value) => {
            if (value === "default") {
              onChange?.(defaultSoundFile);
            } else {
              const soundFile = data?.find((file) => file.id === value);

              if (!soundFile) {
                toast.error("Sound file not found");

                return;
              }

              onChange?.(soundFile);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Notification sound" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2Icon className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <React.Fragment>
                <SongItem soundFile={defaultSoundFile} />

                {data?.map((file) => (
                  <SongItem soundFile={file} key={file.id} />
                ))}

                <Button
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                  className="w-full mt-2 justify-start px-1.5"
                  variant="ghost"
                >
                  <PlusIcon className="w-4 h-4" />
                  <p className="ml-2 text-sm hidden sm:block">Add sound</p>
                </Button>
              </React.Fragment>
            )}
          </SelectContent>
        </Select>
      </div>

      <AddSound
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
        open={isDialogOpen}
        onSoundAdded={onChange}
      />
    </React.Fragment>
  );
};

const SongItem: React.FC<{ soundFile: SoundFile }> = ({ soundFile }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const queryClient = useQueryClient();

  const playSound = () => {
    if (!audioRef.current) {
      return;
    }

    let audioUrl = null;

    if (soundFile.file instanceof File) {
      audioUrl = URL.createObjectURL(soundFile.file);
    } else if (typeof soundFile.file === "string") {
      audioUrl = soundFile.file;
    }

    if (!audioUrl) {
      return;
    }

    audioRef.current.src = audioUrl;

    audioRef.current.play();
  };

  const stopSound = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const deleteSoundFile = async () => {
    if (soundFile.id === "default") {
      toast.error("Cannot delete default sound file");

      return;
    }

    const existingSoundFiles = ((await get("soundFiles")) || []) as SoundFile[];

    await set(
      "soundFiles",
      existingSoundFiles.filter((file) => file.id !== soundFile.id)
    );

    toast.success("Sound file deleted");

    queryClient.invalidateQueries(soundFilesOptions);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio?.addEventListener("play", handlePlay);
    audio?.addEventListener("ended", handleEnded);
    audio?.addEventListener("pause", handleEnded);

    return () => {
      audio?.removeEventListener("play", handlePlay);
      audio?.removeEventListener("ended", handleEnded);
      audio?.removeEventListener("pause", handleEnded);
    };
  }, []);

  return (
    <div key={soundFile.id} className="relative">
      <audio
        onError={() => {
          toast.error("Failed to play audio");
        }}
        ref={audioRef}
        className="hidden"
      />

      <SelectItem value={soundFile.id}>{soundFile.name}</SelectItem>

      <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-2">
        <Button
          className="p-0 hover:opacity-80"
          variant="ghost"
          onClick={!isPlaying ? playSound : stopSound}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </Button>

        <Button
          className="p-0 hover:opacity-80 text-red-500"
          variant="ghost"
          onClick={deleteSoundFile}
          disabled={soundFile.id === "default"}
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SoundUpload;
