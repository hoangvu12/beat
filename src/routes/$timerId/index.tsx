import { portalNode } from "@/components/global-timer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalTimer } from "@/context/global-timer-context";
import { timerQueryOptions } from "@/queries/timer";
import { Timer } from "@/types/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileRoute, Link } from "@tanstack/react-router";
import React from "react";
import * as portals from "react-reverse-portal";

export const Route = new FileRoute("/$timerId/").createRoute({
  component: TimerPage,
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

export interface TimerProps {
  timer: Timer;
  isMinimized?: boolean;
}

function TimerPage() {
  const timerId = Route.useParams().timerId;

  const { data: timer } = useSuspenseQuery(timerQueryOptions(timerId));

  const { timer: existingTimer, setTimer, isRunning } = useGlobalTimer();

  React.useEffect(() => {
    if (!timer) return;

    if (existingTimer) {
      if (existingTimer.id !== timer.id && isRunning) return;
    }

    setTimer(timer);
  }, [timer, setTimer, existingTimer, isRunning]);

  const shouldAsk =
    !!existingTimer && existingTimer?.id !== timer?.id && isRunning;

  return (
    <React.Fragment>
      {shouldAsk && (
        <Dialog open>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Open new timer?</DialogTitle>
              <DialogDescription>
                You are about to open a new timer. The old timer will be paused.
              </DialogDescription>
            </DialogHeader>

            <div>
              <p>
                Current timer:{" "}
                <span
                  className="inline-block w-2 h-2 mr-1 rounded-md"
                  style={{
                    backgroundColor: existingTimer?.color,
                  }}
                ></span>
                <span
                  className="font-semibold"
                  style={{
                    color: existingTimer?.color,
                  }}
                >
                  {existingTimer?.name}
                </span>
              </p>

              <p>
                New timer:{" "}
                <span
                  className="inline-block w-2 h-2 mr-1 rounded-md"
                  style={{
                    backgroundColor: timer?.color,
                  }}
                ></span>
                <span
                  className="font-semibold"
                  style={{
                    color: timer?.color,
                  }}
                >
                  {timer?.name}
                </span>
              </p>
            </div>

            <DialogFooter>
              <Link to="/$timerId" params={{ timerId: existingTimer!.id }}>
                <Button variant="secondary">Open the current timer</Button>
              </Link>

              <Button
                onClick={() => {
                  if (!timer) return;

                  setTimer(timer);
                }}
              >
                Open the new timer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <portals.OutPortal isMinimized={false} node={portalNode} />
    </React.Fragment>
  );
}
