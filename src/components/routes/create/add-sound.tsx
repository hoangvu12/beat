import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import soundFilesOptions from "@/queries/sound-files";
import { SoundFile } from "@/types/core";
import { humanFileSize } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { Upload } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface AddSoundProps extends DialogPrimitive.DialogProps {
  onSoundAdded?: (file: SoundFile) => void;
}

const AddSound: React.FC<AddSoundProps> = ({
  onSoundAdded,
  open,
  onOpenChange,
  ...props
}) => {
  const [soundName, setSoundName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [localSoundFile, setLocalSoundFile] = React.useState<File | null>(null);

  const queryClient = useQueryClient();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleCreateSoundFile = async () => {
    if (!soundName) {
      toast.error("Please enter a sound name");

      return;
    }

    if (!localSoundFile) {
      toast.error("Please upload a sound file");

      return;
    }

    const file: SoundFile = {
      id: uuidv4(),
      name: soundName,
      file: localSoundFile,
    };

    const existingSoundFiles = (await get("soundFiles")) || [];

    await set("soundFiles", [...existingSoundFiles, file]);

    onOpenChange?.(false);
    onSoundAdded?.(file);

    toast.success("Sound file created");

    queryClient.invalidateQueries(soundFilesOptions);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setSoundName("");
        setLocalSoundFile(null);

        onOpenChange?.(open);
      }}
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add sound</DialogTitle>
        </DialogHeader>

        <div className="mb-2">
          <Label htmlFor="sound-name">Sound name</Label>
          <Input
            value={soundName}
            onChange={(e) => {
              setSoundName(e.target.value);
            }}
            id="sound-name"
            placeholder="Sound name"
          />
        </div>

        <div className="mb-2">
          <Label htmlFor="sound-upload">Sound file</Label>

          <Button
            onClick={handleClick}
            className="w-full flex flex-col items-center justify-center aspect-[22/9]"
            variant="outline"
          >
            <Upload className="w-12 h-12" />

            <p className="mt-2 text-base font-medium">
              {localSoundFile
                ? localSoundFile.name
                : "Upload your notification sound"}
            </p>

            {localSoundFile?.size && localSoundFile?.type && (
              <p className="mt-1 text-base text-gray-400">
                {humanFileSize(localSoundFile.size)} - {localSoundFile.type}
              </p>
            )}
          </Button>

          <Input
            onChange={(event) => {
              const file = event.target.files?.[0];
              setLocalSoundFile(file || null);
            }}
            id="sound-upload"
            accept="audio/*"
            ref={inputRef}
            type="file"
            className="hidden"
          />
        </div>

        <Button type="submit" onClick={handleCreateSoundFile}>
          <p className="text-base">Add sound</p>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

AddSound.displayName = "AddSound";

const MemoizedAddSound = React.memo(AddSound);
export default MemoizedAddSound;
