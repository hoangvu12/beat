import { SoundFile } from "@/types/core";
import { queryOptions } from "@tanstack/react-query";
import { get } from "idb-keyval";

const soundFilesOptions = queryOptions({
  queryKey: ["soundFiles"],
  queryFn: async () => {
    const timers = await get("soundFiles");

    return (timers || []) as SoundFile[];
  },
});

export default soundFilesOptions;
