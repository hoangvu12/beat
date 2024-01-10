import "hacktimer";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
