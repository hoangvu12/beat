import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalTimer } from "@/context/global-timer-context";
import { cn } from "@/lib/utils";
import { Timer } from "@/types/core";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  MaximizeIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  TimerResetIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import * as portals from "react-reverse-portal";
import { Time } from "./ui/time-picker";
import { useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { toast } from "sonner";
import { timersQueryOptions } from "@/queries/timers";

// eslint-disable-next-line react-refresh/only-export-components
export const portalNode = portals.createHtmlPortalNode<typeof TimerComponent>({
  attributes: {
    class: "w-full h-full min-h-[inherit]",
  },
});

export interface TimerProps {
  timer: Timer;
  isMinimized?: boolean;
  onRun?: (isRunning: boolean) => void;
}

const isTimeEmpty = (time: Time) => {
  return time.hours === 0 && time.minutes === 0 && time.seconds === 0;
};

const GlobalTimer = () => {
  const router = useRouter();

  const [isMatch, setIsMatch] = React.useState(
    // @ts-expect-error matchRoute expect params, which is not needed here
    !!router.matchRoute({ to: "/$timerId" })
  );
  const { timer, setIsRunning } = useGlobalTimer();

  useEffect(() => {
    const unsub = router.subscribe("onResolved", (e) => {
      console.log("resolved", timer?.id, e.toLocation.href);

      setIsMatch(e.toLocation.href === `/${timer?.id}`);
    });

    return unsub;
  }, [timer, router]);

  useEffect(() => {
    // @ts-expect-error matchRoute expect params, which is not needed here
    setIsMatch(!!router.matchRoute({ to: "/$timerId" }));
  }, [router, timer?.id]);

  return (
    <React.Fragment>
      <portals.InPortal node={portalNode}>
        {timer && <TimerComponent onRun={setIsRunning} timer={timer} />}
      </portals.InPortal>

      {!isMatch && (
        <portals.OutPortal<typeof TimerComponent>
          isMinimized={true}
          node={portalNode}
        />
      )}
    </React.Fragment>
  );
};

export const TimerComponent: React.FC<TimerProps> = ({
  timer,
  isMinimized = false,
  onRun,
}) => {
  const [time, setTime] = React.useState(timer.time);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const { setTimer } = useGlobalTimer();

  const countDownInterval = React.useRef<NodeJS.Timeout>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const audioRef = React.useRef<HTMLAudioElement>(new Audio());

  const playAudio = () => {
    audioRef.current.play();
    audioRef.current.volume = timer.volume;
  };

  const pauseAudio = () => {
    audioRef.current.pause();

    setIsAudioPlaying(false);
  };

  const deleteTimer = async () => {
    const timers = (await get("timers")) as Timer[] | undefined;

    if (!timers) return;

    const newTimers = timers.filter((t) => t.id !== timer.id);

    await set("timers", newTimers);

    toast.success(
      <span>
        Successfully deleted <span className="font-semibold">{timer.name}</span>
        .
      </span>
    );

    setTimer(null);

    queryClient.invalidateQueries(timersQueryOptions);
  };

  const setAudioSrc = () => {
    // Because the browser will not load this audio when the tab is inactive
    // We have the load the audio first so that it can be played
    let audioUrl = "";

    if (typeof timer.file === "string") {
      audioUrl = timer.file;
    } else {
      audioUrl = URL.createObjectURL(timer.file);
    }

    audioRef.current.src = audioUrl;
  };

  const startTimer = () => {
    setAudioSrc();

    if (isTimeEmpty(time)) {
      setTime(timer.time);
    }

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
          audioRef.current.currentTime = 0;

          playAudio();

          if (timer.isOneTime) {
            deleteTimer();

            navigate({ to: "/", replace: true });

            return timer.time;
          }

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

  useEffect(() => {
    setTime(timer.time);
    pauseTimer();
  }, [timer.time]);

  useEffect(() => {
    onRun?.(isRunning);
  }, [isRunning, onRun]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsAudioPlaying(false);

      console.log("HANDLE ENDED");
    };

    const handlePlay = () => {
      setIsAudioPlaying(true);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handleEnded);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handleEnded);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  if (isMinimized) {
    return (
      <div className="gap-4 sm:gap-8 flex flex-wrap items-center justify-center fixed top-0 right-0 sm:top-auto sm:bottom-4 sm:right-4 bg-secondary px-4 py-2 rounded-md">
        <div className="flex gap-2">
          <p className="text-2xl font-bold uppercase tabular-nums">
            {time.hours.toString().padStart(2, "0")}
          </p>

          <p className="text-2xl font-bold uppercase tabular-nums">:</p>

          <p className="text-2xl font-bold uppercase tabular-nums">
            {time.minutes.toString().padStart(2, "0")}
          </p>

          <p className="text-2xl font-bold uppercase">:</p>

          <p className="text-2xl font-bold uppercase mt-0 tabular-nums">
            {time.seconds.toString().padStart(2, "0")}
          </p>
        </div>

        <div className="flex items-center gap-2">
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
                  buttonVariants({
                    className: "py-4",
                    variant: "default",
                  })
                )}
              >
                <div className="flex items-center">
                  {isRunning ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                {isRunning ? "Pause the timer" : "Start the timer"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  buttonVariants({
                    variant: "outline",
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
                      variant: "outline",
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

          <Link to="/$timerId" params={{ timerId: timer.id }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      className: "grow py-4",
                    })
                  )}
                >
                  <MaximizeIcon className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  Open the timer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  setAudioSrc();

                  if (isAudioPlaying) {
                    pauseAudio();
                  } else {
                    playAudio();
                  }
                }}
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                    className: "grow py-4",
                  })
                )}
              >
                {isAudioPlaying ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                {isAudioPlaying ? "Pause the sound" : "Play the sound"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }

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
        <p className="text-8xl md:text-9xl font-bold uppercase tabular-nums">
          {time.hours.toString().padStart(2, "0")}
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase hidden md:block tabular-nums">
          :
        </p>
        <p className="text-8xl md:text-9xl font-bold uppercase md:hidden -mt-14 md:-mt-20 tabular-nums">
          ..
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase tabular-nums">
          {time.minutes.toString().padStart(2, "0")}
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase hidden md:block tabular-nums">
          :
        </p>
        <p className="text-8xl md:text-9xl font-bold uppercase md:hidden -mt-14 md:-mt-20 tabular-nums">
          ..
        </p>

        <p className="text-8xl md:text-9xl font-bold uppercase mt-0 tabular-nums">
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

          <Link
            to="/$timerId/edit"
            className="block"
            params={{ timerId: timer.id }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "grow py-4 h-full",
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  setAudioSrc();

                  if (isAudioPlaying) {
                    pauseAudio();
                  } else {
                    playAudio();
                  }
                }}
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                    className: "grow py-4",
                  })
                )}
              >
                {isAudioPlaying ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                {isAudioPlaying ? "Pause the sound" : "Play the sound"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default GlobalTimer;
