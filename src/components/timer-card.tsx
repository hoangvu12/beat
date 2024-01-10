import { cn } from "@/lib/utils";
import { Timer } from "@/types/core";
import { formatTime } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { get, set } from "idb-keyval";
import { Pencil, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "./ui/button";
import { timersQueryOptions } from "@/queries/timers";

interface TimerCardProps {
  timer: Timer;
}

const TimerCard: React.FC<TimerCardProps> = ({ timer }) => {
  const queryClient = useQueryClient();

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

    queryClient.invalidateQueries(timersQueryOptions);
  };

  return (
    <div
      className={cn(
        buttonVariants({
          className:
            "flex items-center justify-between w-full rounded-md px-4 py-3",
          variant: "secondary",
        })
      )}
    >
      <Link
        className="block w-full"
        to="/$timerId"
        params={{ timerId: timer.id }}
      >
        <div className="w-full">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: timer.color }}
              />
              <p className="font-semibold text-lg">{timer.name}</p>
            </div>

            <span>
              <span className="text-gray-200 font-semibold text-base">
                Time:
              </span>{" "}
              <span className="text-gray-300 font-medium text-base">
                {formatTime(timer.time)}
              </span>
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/$timerId/edit" params={{ timerId: timer.id }}>
          <Button variant="ghost">
            <Pencil className="w-5 h-5" />
          </Button>
        </Link>

        <Button onClick={deleteTimer} variant="destructive">
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default TimerCard;
