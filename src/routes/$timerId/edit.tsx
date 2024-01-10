import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/$timerId/edit").createRoute({
  component: EditTimersComponent,
});

function EditTimersComponent() {
  return (
    <div className="p-2">
      <h3>EditTimers</h3>
    </div>
  );
}
