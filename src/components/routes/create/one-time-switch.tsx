import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface OneTimeSwitchProps {
  isOneTime: boolean;
  onChange?: (isOneTime: boolean) => void;
  disabled?: boolean;
}

const OneTimeSwitch: React.FC<OneTimeSwitchProps> = ({
  isOneTime,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor="interval-switch" className="block text-base">
          One time
        </Label>

        <p className="text-base text-muted-foreground">
          Delete the timer after it ends
        </p>
      </div>

      <Switch
        checked={isOneTime}
        onCheckedChange={(checked) => {
          onChange?.(checked);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default OneTimeSwitch;
