import { Timer } from "@/types/core";
import { queryOptions } from "@tanstack/react-query";
import { get } from "idb-keyval";

export const timersQueryKey = ["timers"];

export const timersQueryOptions = queryOptions({
  queryKey: timersQueryKey,
  queryFn: async () => {
    const timers = await get("timers");

    return (timers || []) as Timer[];
  },
});
