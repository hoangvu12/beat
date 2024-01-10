import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { humanFileSize } from "@/utils";
import { Upload } from "lucide-react";
import React from "react";

interface SoundUploadProps {
  onChange?: (file: File) => void;
  file: File | null;
}

const SoundUpload: React.FC<SoundUploadProps> = ({ file, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <React.Fragment>
      <Label htmlFor="sound-upload" className="block text-base mb-1">
        Notification sound
      </Label>

      <Button
        onClick={handleClick}
        className="w-full flex flex-col items-center justify-center aspect-[22/9]"
        variant="outline"
      >
        <Upload className="w-12 h-12" />

        <p className="mt-2 text-base font-medium">
          {file ? file.name : "Upload your notification sound"}
        </p>

        {file?.size && file?.type && (
          <p className="mt-1 text-base text-gray-400">
            {humanFileSize(file.size)} - {file.type}
          </p>
        )}
      </Button>

      <Input
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onChange?.(file);
          }
        }}
        id="sound-upload"
        accept="audio/*"
        ref={inputRef}
        type="file"
        className="hidden"
      />
    </React.Fragment>
  );
};

export default SoundUpload;
