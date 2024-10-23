import GlobalTimer from "@/components/global-timer";
import { GITHUB_URL } from "@/constants";
import { GlobalTimerProvider } from "@/context/global-timer-context";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, rootRouteWithContext } from "@tanstack/react-router";

import "/HackTimer.js?url";

export const Route = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <GlobalTimerProvider>
      <div className="container">
        <div className="min-h-[calc(100vh-var(--footer-height))]">
          <Outlet />
        </div>

        <div className="flex items-center justify-center h-[var(--footer-height)]">
          <span>
            Made with ❤️ by{" "}
            <a href={GITHUB_URL} target="_blank" className="hover:underline">
              <span>hoangvu12</span>
            </a>
          </span>
        </div>

        <GlobalTimer />
      </div>
    </GlobalTimerProvider>
  );
}
