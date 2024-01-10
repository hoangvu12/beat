import React from "react";

import { Label } from "@/components/ui/label";
import BaseColorPicker from "@/components/ui/color-picker";
import { CheckIcon, PipetteIcon } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const existingColors = [
  "#FF5733", // a bright red
  "#33FF57", // a bright green
  "#5733FF", // a bright blue
  "#FF33F6", // a bright pink
  "#F6FF33", // a bright yellow
  "#33FFF6", // a bright cyan
  "#FF8833", // a bright orange
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [localColor, setLocalColor] = React.useState<string>("#510202");

  return (
    <React.Fragment>
      <div className="mb-2 flex items-center gap-2">
        {color && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}

        <Label className="block text-base">Label color</Label>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {existingColors.map((existingColor) => (
          <button
            key={existingColor}
            className="flex items-center justify-center w-32 flex-1 aspect-[9/16] rounded-md"
            style={{ backgroundColor: existingColor }}
            onClick={() => onChange(existingColor)}
          >
            {existingColor === color && (
              <CheckIcon className="w-5 h-5 text-white bg-black rounded-md" />
            )}
          </button>
        ))}

        <BaseColorPicker
          color={localColor}
          onChange={(color) => {
            setLocalColor(color);
            onChange(color);
          }}
          className="relative flex-1 aspect-[9/16] rounded-md"
          trigger={
            <div
              className="relative flex items-center justify-center flex-1 aspect-[9/16] rounded-md"
              style={{
                backgroundColor: localColor,
              }}
            >
              <PipetteIcon className="bg-black w-6 h-6 text-white p-1" />
            </div>
          }
        />
      </div>
    </React.Fragment>
  );
};

export default ColorPicker;
