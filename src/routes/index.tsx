import TimerCard from "@/components/timer-card";
import { Button } from "@/components/ui/button";
import { timersQueryOptions } from "@/queries/timers";
import { FileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

export const Route = new FileRoute("/").createRoute({
  component: Home,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(timersQueryOptions);
  },
});

function Home() {
  const { data } = useSuspenseQuery(timersQueryOptions);

  return (
    <div className="min-h-[inherit] flex flex-col justify-center w-full overflow-y-auto py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your timers</h1>

        <Link to="/create">
          <Button variant="secondary">
            <PlusIcon className="w-6 h-6" />

            <p className="ml-2 text-base hidden sm:block">Add timer</p>
          </Button>
        </Link>
      </div>

      <div className="space-y-2 mt-4">
        {!data?.length ? (
          <p className="text-center mt-2 text-base">
            You have no timers.{" "}
            <Link to="/create" className="hover:underline">
              Create one
            </Link>
          </p>
        ) : (
          data.map((timer) => <TimerCard timer={timer} key={timer.id} />)
        )}
      </div>
    </div>
  );
}
