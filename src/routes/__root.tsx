import { GITHUB_URL } from "@/constants";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, rootRouteWithContext } from "@tanstack/react-router";

export const Route = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
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
    </div>
  );
}
