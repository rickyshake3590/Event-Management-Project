import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import type { Registration } from "@/types";
import { formatDateRange, formatDateTime } from "@/utils/format";

export function RegistrationsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const events = useAppStore((s) => s.events);
  const registrations = useAppStore((s) => s.registrations);
  const registerForEvent = useAppStore((s) => s.registerForEvent);
  const withdrawRegistration = useAppStore((s) => s.withdrawRegistration);

  if (currentUser.role === "attendee") {
    if (eventId) {
      const event = events.find((e) => e.id === eventId);
      if (!event) return <p className="text-sm text-gray-500 dark:text-gray-400">Event not found.</p>;
      const myReg = registrations.find(
        (r) => r.eventId === event.id && r.attendeeId === currentUser.id
      );
      return (
        <div className="mx-auto max-w-xl">
          <PageHeader title={event.name} description="Feature 14 — Attendee Registration" />
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateRange(event.startDateTime, event.endDateTime)}</p>
              <p className="mt-3 text-sm">
                Status:{" "}
                <span className="font-medium">
                  {myReg?.status === "registered" ? "You're registered" : "Not registered"}
                </span>
              </p>
              <div className="mt-4 flex gap-2">
                {myReg?.status === "registered" ? (
                  <Button variant="secondary" onClick={() => withdrawRegistration(event.id)}>
                    Withdraw Registration
                  </Button>
                ) : (
                  <Button onClick={() => registerForEvent(event.id)}>Register</Button>
                )}
                <Button variant="ghost" onClick={() => navigate("/registrations")}>
                  Back to My Registrations
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    const mine = registrations.filter((r) => r.attendeeId === currentUser.id);
    const columns: Column<Registration>[] = [
      {
        header: "Event",
        render: (r) => {
          const event = events.find((e) => e.id === r.eventId);
          return (
            <Link to={`/events/${r.eventId}`} className="font-medium text-primary-700 dark:text-primary-300 hover:underline">
              {event?.name ?? r.eventId}
            </Link>
          );
        },
      },
      { header: "Registered on", render: (r) => formatDateTime(r.registeredAt) },
      { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];

    return (
      <div>
        <PageHeader
          title="My Registrations"
          description="Feature 14 — View registration status and withdraw if plans change."
          actions={
            <Link to="/events">
              <Button variant="secondary">Browse Events</Button>
            </Link>
          }
        />
        <DataTable columns={columns} rows={mine} rowKey={(r) => r.id} emptyMessage="You haven't registered for any events yet." />
      </div>
    );
  }

  // Organiser / Coordinator view
  if (eventId) {
    const event = events.find((e) => e.id === eventId);
    if (!event) return <p className="text-sm text-gray-500 dark:text-gray-400">Event not found.</p>;
    const regs = registrations.filter((r) => r.eventId === eventId);
    const columns: Column<Registration>[] = [
      { header: "Attendee", render: (r) => r.attendeeName },
      { header: "Registered on", render: (r) => formatDateTime(r.registeredAt) },
      { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <div>
        <PageHeader
          title={`Registrations — ${event.name}`}
          description="Feature 14 — Organisers and Coordinators can view registration info for their events."
          actions={
            <Link to={`/events/${event.id}`}>
              <Button variant="secondary">Back to Event</Button>
            </Link>
          }
        />
        <DataTable columns={columns} rows={regs} rowKey={(r) => r.id} emptyMessage="No registrations yet." />
      </div>
    );
  }

  const relevant = events.filter((e) =>
    e.registrationEnabled &&
    (currentUser.role === "coordinator" || e.organiserId === currentUser.id)
  );

  return (
    <div>
      <PageHeader
        title="Event Registrations"
        description="Select an event to view its attendee registrations."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {relevant.map((e) => {
          const count = registrations.filter((r) => r.eventId === e.id && r.status === "registered").length;
          return (
            <Card key={e.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{e.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{count} registered</p>
                  </div>
                  <Link to={`/registrations/${e.id}`}>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
        {relevant.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No registration-enabled events yet.</p>
        )}
      </div>
    </div>
  );
}
