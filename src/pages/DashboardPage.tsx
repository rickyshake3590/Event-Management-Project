import { Link } from "react-router-dom";
import { useAppStore, notificationsForCurrentUser } from "@/store/useAppStore";
import { Card, CardBody } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventCard } from "@/components/domain/EventCard";
import { roleLabels } from "@/components/layout/navConfig";

function StatCard({ label, value, to }: { label: string; value: number | string; to: string }) {
  return (
    <Link to={to}>
      <Card className="transition-shadow hover:shadow-md">
        <CardBody>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </CardBody>
      </Card>
    </Link>
  );
}

export function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const events = useAppStore((s) => s.events);
  const bookings = useAppStore((s) => s.bookings);
  const equipmentRequests = useAppStore((s) => s.equipmentRequests);
  const registrations = useAppStore((s) => s.registrations);
  const venues = useAppStore((s) => s.venues);
  const equipment = useAppStore((s) => s.equipment);
  const notifications = useAppStore(notificationsForCurrentUser);

  const unread = notifications.filter((n) => !n.read).length;

  let content;
  if (currentUser.role === "organiser") {
    const mine = events.filter((e) => e.organiserId === currentUser.id);
    content = (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="My Events" value={mine.length} to="/events" />
          <StatCard label="Drafts" value={mine.filter((e) => e.status === "draft").length} to="/events" />
          <StatCard
            label="Awaiting Review"
            value={mine.filter((e) => ["submitted", "under_review"].includes(e.status)).length}
            to="/events"
          />
          <StatCard label="Unread Notifications" value={unread} to="/notifications" />
        </div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Recent events</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {mine.slice(0, 4).map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </>
    );
  } else if (currentUser.role === "coordinator") {
    const needsReview = events.filter((e) => ["submitted", "under_review"].includes(e.status));
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    content = (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Awaiting My Review" value={needsReview.length} to="/events" />
          <StatCard label="Pending Bookings" value={pendingBookings.length} to="/bookings" />
          <StatCard
            label="Equipment Requests"
            value={equipmentRequests.filter((r) => r.status === "requested").length}
            to="/equipment/requests"
          />
          <StatCard label="Unread Notifications" value={unread} to="/notifications" />
        </div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Events needing review</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {needsReview.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Nothing pending review.</p>}
          {needsReview.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </>
    );
  } else if (currentUser.role === "venue_staff") {
    const pending = bookings.filter((b) => b.status === "pending");
    content = (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Pending Requests" value={pending.length} to="/bookings" />
          <StatCard label="Conflicts Flagged" value={pending.filter((b) => b.conflict).length} to="/bookings" />
          <StatCard label="Venues Managed" value={venues.length} to="/venues" />
          <StatCard label="Unread Notifications" value={unread} to="/notifications" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review pending venue booking requests from the <Link className="text-primary-700 dark:text-primary-300 underline" to="/bookings">Bookings</Link> page.
        </p>
      </>
    );
  } else if (currentUser.role === "tech_support") {
    const pending = equipmentRequests.filter((r) => r.status === "requested");
    content = (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Pending Requests" value={pending.length} to="/equipment/requests" />
          <StatCard
            label="Reserved"
            value={equipmentRequests.filter((r) => r.status === "reserved").length}
            to="/equipment"
          />
          <StatCard label="Equipment Types" value={equipment.length} to="/equipment/availability" />
          <StatCard label="Unread Notifications" value={unread} to="/notifications" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check <Link className="text-primary-700 dark:text-primary-300 underline" to="/equipment/availability">availability</Link> before
          approving new requests.
        </p>
      </>
    );
  } else {
    const myRegs = registrations.filter((r) => r.attendeeId === currentUser.id && r.status === "registered");
    const upcoming = events.filter((e) => e.registrationEnabled && e.status !== "draft" && e.status !== "cancelled");
    content = (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="My Registrations" value={myRegs.length} to="/registrations" />
          <StatCard label="Events Open" value={upcoming.length} to="/events" />
          <StatCard label="Unread Notifications" value={unread} to="/notifications" />
        </div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming events you can join</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.slice(0, 4).map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description={`${roleLabels[currentUser.role]} dashboard`}
      />
      {content}
    </div>
  );
}
