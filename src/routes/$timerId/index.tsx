import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { timerQueryOptions } from "@/queries/timer";
import { FileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  TimerResetIcon,
} from "lucide-react";
import React from "react";

export const Route = new FileRoute("/$timerId/").createRoute({
  component: TimersComponent,
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

function TimersComponent() {
  const timer = Route.useLoaderData()!;

  const [time, setTime] = React.useState(timer.time);
  const [isRunning, setIsRunning] = React.useState(false);

  const countDownInterval = React.useRef<NodeJS.Timeout>();

  const audioRef = React.useRef<HTMLAudioElement>(new Audio());

  const playAudio = () => {
    const audioUrl = URL.createObjectURL(timer.file);

    audioRef.current.src = audioUrl;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const startTimer = () => {
    setIsRunning(true);

    countDownInterval.current = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1,
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          };
        } else if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59,
          };
        } else {
          playAudio();

          if (timer.isInterval) {
            return timer.time;
          }

          pauseTimer();

          return prev;
        }
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);

    clearInterval(countDownInterval.current!);
  };

  const resetTimer = () => {
    setTime(timer.time);

    pauseTimer();
  };

  return (
    <div className="py-20 relative flex flex-col items-center justify-center h-full w-full min-h-[inherit]">
      <Link to="/">
        <Button
          variant="ghost"
          className="flex items-center absolute left-4 top-4 md:left-4 md:top-16"
        >
          <ArrowLeftIcon className="w-6 h-6 mr-2 shrink-0" />

          <p className="text-xl">Go back</p>
        </Button>
      </Link>

      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-sm"
          style={{
            backgroundColor: timer.color,
          }}
        />
        <p
          className="font-semibold text-xl"
          style={{
            color: timer.color,
          }}
        >
          {timer.name}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
        <p className="text-8xl md:text-9xl font-bold uppercase">
          {time.hours.toString().padStart(2, "0")}
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase hidden md:block">
          :
        </p>
        <p className="text-8xl md:text-9xl font-bold uppercase md:hidden -mt-14 md:-mt-20">
          ..
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase">
          {time.minutes.toString().padStart(2, "0")}
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase hidden md:block">
          :
        </p>
        <p className="text-8xl md:text-9xl font-bold uppercase md:hidden -mt-14 md:-mt-20">
          ..
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase mt-0">
          {time.seconds.toString().padStart(2, "0")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mt-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                if (isRunning) {
                  pauseTimer();
                } else {
                  startTimer();
                }
              }}
              className={cn(
                buttonVariants({ className: "px-16 py-4", variant: "default" })
              )}
            >
              <div className="flex items-center">
                {isRunning ? (
                  <React.Fragment>
                    <PauseIcon className="w-5 h-5 mr-3" />

                    <p className="uppercase font-semibold text-base">Pause</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <PlayIcon className="w-5 h-5 mr-3" />

                    <p className="uppercase font-semibold text-base">Start</p>
                  </React.Fragment>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              {isRunning ? "Pause the timer" : "Start the timer"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex gap-2 grow">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    className: "grow py-4",
                  })
                )}
                onClick={resetTimer}
              >
                <TimerResetIcon className="w-5 h-5" />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                Reset the timer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link to="/$timerId/edit" params={{ timerId: timer.id }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "grow py-4",
                    })
                  )}
                >
                  <PencilIcon className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  Edit the timer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      </div>
    </div>
  );
}
