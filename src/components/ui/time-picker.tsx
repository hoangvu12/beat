import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";
import { Button } from "./button";

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  selected: Time | undefined;
  onChange: (time: Time) => void;
}

const rangeToArray = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

const hours = rangeToArray(0, 24);
const minutes = rangeToArray(0, 59);
const seconds = rangeToArray(0, 59);

const defaultTime = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const TimePicker: React.FC<TimePickerProps> = ({
  onChange,
  selected,
  className,
  ...props
}) => {
  const hoursColumn = useRef<HTMLDivElement>(null);
  const minutesColumn = useRef<HTMLDivElement>(null);
  const secondsColumn = useRef<HTMLDivElement>(null);

  const handleChange = (time: Partial<Time>) => {
    onChange({ ...defaultTime, ...(selected || {}), ...time });
  };

  const scroll = useCallback(
    (isSmooth: boolean) => {
      if (!selected) return;

      const hoursElement = hoursColumn.current?.querySelector(
        `[data-hour="${selected.hours}"]`
      );
      const minutesElement = minutesColumn.current?.querySelector(
        `[data-minute="${selected.minutes}"]`
      );
      const secondsElement = secondsColumn.current?.querySelector(
        `[data-second="${selected.seconds}"]`
      );

      const scrollOptions: ScrollIntoViewOptions = {
        block: "center",
        behavior: isSmooth ? "smooth" : "auto",
      };

      hoursElement?.scrollIntoView(scrollOptions);
      minutesElement?.scrollIntoView(scrollOptions);
      secondsElement?.scrollIntoView(scrollOptions);
    },
    [selected]
  );

  useEffect(() => {
    scroll(true);
  }, [scroll]);

  useEffect(() => {
    scroll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("bg-background w-64", className)} {...props}>
      <div className="flex h-72 w-full space-x-2">
        <div ref={hoursColumn} className="p-1 flex-1 overflow-y-auto">
          {hours.map((hour) => (
            <Button
              key={hour}
              variant={selected?.hours === hour ? "default" : "ghost"}
              className="w-full"
              onClick={() => handleChange({ hours: hour })}
              data-hour={hour}
            >
              {hour}
            </Button>
          ))}
        </div>

        <div ref={minutesColumn} className="p-1 flex-1 overflow-y-auto">
          {minutes.map((minute) => (
            <Button
              key={minute}
              variant={selected?.minutes === minute ? "default" : "ghost"}
              className="w-full"
              onClick={() => handleChange({ minutes: minute })}
              data-minute={minute}
            >
              {minute}
            </Button>
          ))}
        </div>

        <div ref={secondsColumn} className="p-1 flex-1 overflow-y-auto">
          {seconds.map((second) => (
            <Button
              key={second}
              variant={selected?.seconds === second ? "default" : "ghost"}
              className="w-full"
              onClick={() => handleChange({ seconds: second })}
              data-second={second}
            >
              {second}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
