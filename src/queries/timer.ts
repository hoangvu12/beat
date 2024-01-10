import { Timer } from "@/types/core";
import { queryOptions } from "@tanstack/react-query";
import { get } from "idb-keyval";

export const timerQueryOptions = (timerId: string) =>
  queryOptions({
    queryKey: ["timer", timerId],
    queryFn: async () => {
      const timers = (await get("timers")) as Timer[];

      return timers.find((timer) => timer.id === timerId);
    },
  });
