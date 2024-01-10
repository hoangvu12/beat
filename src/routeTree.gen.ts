import { Route as rootRoute } from "./routes/__root"
import { Route as IndexImport } from "./routes"
import { Route as TimerIdEditImport } from "./routes/$timerId/edit"
import { Route as CreateIndexImport } from "./routes/create"
import { Route as TimerIdIndexImport } from "./routes/$timerId"

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const TimerIdEditRoute = TimerIdEditImport.update({
  path: "/$timerId/edit",
  getParentRoute: () => rootRoute,
} as any)

const CreateIndexRoute = CreateIndexImport.update({
  path: "/create/",
  getParentRoute: () => rootRoute,
} as any)

const TimerIdIndexRoute = TimerIdIndexImport.update({
  path: "/$timerId/",
  getParentRoute: () => rootRoute,
} as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/$timerId/": {
      preLoaderRoute: typeof TimerIdIndexImport
      parentRoute: typeof rootRoute
    }
    "/create/": {
      preLoaderRoute: typeof CreateIndexImport
      parentRoute: typeof rootRoute
    }
    "/$timerId/edit": {
      preLoaderRoute: typeof TimerIdEditImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  TimerIdIndexRoute,
  CreateIndexRoute,
  TimerIdEditRoute,
])
