# ConnectSphere — Frontend (Round 1 draft)

A static/mock React frontend for ConnectSphere, an event management system with five roles
(Event Organiser, Event Coordinator, Venue Staff, Technical Support Staff, Attendee) and the
20 core Release 1 features from `EVENT_MANAGEMENT_FRONTEND_PROMPT.md`.

This is a clickable draft: all data is in-memory mock data (`src/data/mockData.ts`) managed by
a Zustand store (`src/store/useAppStore.ts`). There is no backend yet — a **role switcher** in
the top bar stands in for authentication so you can preview every role's view instantly.

## Stack

- **React 18 + TypeScript + Vite**
- **React Router** for routing (see `src/App.tsx` for the full route table)
- **Zustand** for global/server-mock state — a single store holds users, events, venues,
  bookings, equipment, registrations, and notifications, with actions that model the real
  workflows (submit → review → approve, booking conflict detection, equipment availability
  checks, change-request cascades, etc.)
- **Tailwind CSS** for styling, with a small design-token palette (`tailwind.config.js`)

## Getting started

```
npm install
npm run dev
```

Then open the printed local URL. Use the role dropdown in the top-right to switch between
Organiser, Coordinator, Venue Staff, Technical Support, and Attendee views.

## Structure

```
src/
  components/
    layout/     AppShell, Sidebar, TopNav, role-based nav config
    ui/         Button, Card, Modal, DataTable, StatusBadge, form controls, Stepper
    domain/     EventCard, VenueCard, BookingCard + BookingDetailModal, ConflictAlert,
                EquipmentReservationForm, NotificationItem, SubmitBookingModal
  pages/        One file per route (event list/detail/create/edit, venues, bookings,
                equipment, registrations, notifications, settings, dashboard)
  store/        useAppStore.ts — all mock "server" state and actions
  data/         mockData.ts — seed data
  types/        Shared TypeScript types (EventRecord, Venue, Booking, etc.)
```

## Next steps

This covers Round 1/2 of the proposal (component structure + clickable mockup with mock
data). Round 3+ would connect this to a real API, add persistence, and layer in
authentication in place of the demo role switcher.
