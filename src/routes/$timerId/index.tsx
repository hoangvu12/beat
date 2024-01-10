import { portalNode } from "@/components/global-timer";
import { Button } from "@/components/ui/button";
import { useGlobalTimer } from "@/context/global-timer-context";
import { timerQueryOptions } from "@/queries/timer";
import { Timer } from "@/types/core";
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
  const timer = Route.useLoaderData()!;

  const { setTimer } = useGlobalTimer();

  React.useEffect(() => {
    console.log("set timer", timer);

    setTimer(timer);
  }, [timer, setTimer]);

  return <portals.OutPortal isMinimized={false} node={portalNode} />;
}
