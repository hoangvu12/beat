import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface IntervalSwitchProps {
  isInterval: boolean;
  onChange?: (isInterval: boolean) => void;
}

const IntervalSwitch: React.FC<IntervalSwitchProps> = ({
  isInterval,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor="interval-switch" className="block text-base">
          Interval
        </Label>

        <p className="text-base text-muted-foreground">
          Repeat the timer after it ends
        </p>
      </div>

      <Switch
        checked={isInterval}
        onCheckedChange={(checked) => {
          onChange?.(checked);
        }}
      />
    </div>
  );
};

export default IntervalSwitch;
