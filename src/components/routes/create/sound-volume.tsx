import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import React from "react";

interface SoundVolumeProps {
  volume: number;
  onChange?: (volume: number) => void;
}

const SoundVolume: React.FC<SoundVolumeProps> = ({ volume, onChange }) => {
  return (
    <React.Fragment>
      <Label htmlFor="sound-volume" className="block text-base mb-1">
        Notification sound volume
      </Label>

      <div className="flex ">
        <Slider
          id="sound-volume"
          defaultValue={[1]}
          max={1}
          step={0.01}
          onValueChange={(value) => {
            onChange?.(value[0]);
          }}
        />

        <p className="ml-2 text-base font-medium">
          {Math.floor(volume * 100)}%
        </p>
      </div>
    </React.Fragment>
  );
};

export default SoundVolume;
