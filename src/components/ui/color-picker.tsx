import React from "react";
import { RgbaStringColorPicker } from "react-colorful";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  color: string;
  onChange: (color: string) => void;
  trigger?: React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  className,
  ...props
}) => {
  const {
    trigger = (
      <div
        style={{
          backgroundColor: color,
        }}
        className={className}
        {...props}
      ></div>
    ),
  } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-max bg-secondary">
        <RgbaStringColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
