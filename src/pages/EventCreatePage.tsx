import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { CheckboxGroup, Select, TextArea, TextInput } from "@/components/ui/FormControls";
import type { EventRecord } from "@/types";

const STEPS = ["Basic Information", "Schedule & Venue Needs", "Equipment & Registration"];

const FACILITY_OPTIONS = ["Catering", "AV System", "Parking", "Stage", "Projector", "Whiteboard"];
const ACCESSIBILITY_OPTIONS = [
  "Wheelchair ramps",
  "Accessible restrooms",
  "Hearing loop",
  "Elevator access",
];
const LAYOUT_OPTIONS = ["Theatre", "Banquet", "Classroom", "Reception", "Boardroom", "Workshop"];

type FormState = {
  name: string;
  purpose: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  expectedAttendance: string;
  minCapacity: string;
  accessibility: string[];
  facilities: string[];
  layout: string;
  equipmentNeeds: string;
  registrationEnabled: boolean;
};

const initialState: FormState = {
  name: "",
  purpose: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
  expectedAttendance: "",
  minCapacity: "",
  accessibility: [],
  facilities: [],
  layout: "",
  equipmentNeeds: "",
  registrationEnabled: false,
};

export function EventCreatePage() {
  const navigate = useNavigate();
  const createDraftEvent = useAppStore((s) => s.createDraftEvent);
  const submitEvent = useAppStore((s) => s.submitEvent);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) next.name = "Event name is required.";
      if (!form.purpose.trim()) next.purpose = "Purpose is required.";
    }
    if (step === 1) {
      if (!form.startDateTime) next.startDateTime = "Start date/time is required.";
      if (!form.endDateTime) next.endDateTime = "End date/time is required.";
      if (!form.expectedAttendance) next.expectedAttendance = "Expected attendance is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toRecord = (): Partial<EventRecord> => ({
    name: form.name,
    purpose: form.purpose,
    description: form.description,
    startDateTime: form.startDateTime ? new Date(form.startDateTime).toISOString() : undefined,
    endDateTime: form.endDateTime ? new Date(form.endDateTime).toISOString() : undefined,
    expectedAttendance: Number(form.expectedAttendance) || 0,
    venueRequirements: {
      minCapacity: Number(form.minCapacity) || Number(form.expectedAttendance) || 0,
      accessibility: form.accessibility,
      facilities: form.facilities,
      layout: form.layout,
    },
    equipmentNeeds: form.equipmentNeeds,
    registrationEnabled: form.registrationEnabled,
  });

  const saveDraft = () => {
    const record = createDraftEvent(toRecord());
    navigate(`/events/${record.id}`);
  };

  const submit = () => {
    if (!validateStep()) return;
    const record = createDraftEvent(toRecord());
    submitEvent(record.id);
    navigate(`/events/${record.id}`);
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Create New Event Request" description="Feature 1 — Event Request Creation" />
      <Stepper steps={STEPS} current={step} />

      <Card>
        <CardBody>
          {step === 0 && (
            <div>
              <TextInput
                label="Event name"
                required
                value={form.name}
                error={errors.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Annual Gala"
              />
              <TextInput
                label="Purpose"
                required
                value={form.purpose}
                error={errors.purpose}
                onChange={(e) => set("purpose", e.target.value)}
                placeholder="e.g. Fundraising"
              />
              <TextArea
                label="Description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Give reviewers context on what this event involves."
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <TextInput
                  label="Start date & time"
                  type="datetime-local"
                  required
                  value={form.startDateTime}
                  error={errors.startDateTime}
                  onChange={(e) => set("startDateTime", e.target.value)}
                />
                <TextInput
                  label="End date & time"
                  type="datetime-local"
                  required
                  value={form.endDateTime}
                  error={errors.endDateTime}
                  onChange={(e) => set("endDateTime", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <TextInput
                  label="Expected attendance"
                  type="number"
                  min={1}
                  required
                  value={form.expectedAttendance}
                  error={errors.expectedAttendance}
                  onChange={(e) => set("expectedAttendance", e.target.value)}
                />
                <TextInput
                  label="Minimum venue capacity"
                  type="number"
                  min={1}
                  hint="Leave blank to match expected attendance"
                  value={form.minCapacity}
                  onChange={(e) => set("minCapacity", e.target.value)}
                />
              </div>
              <Select
                label="Preferred room layout"
                value={form.layout}
                onChange={(e) => set("layout", e.target.value)}
                options={LAYOUT_OPTIONS.map((l) => ({ value: l, label: l }))}
              />
              <CheckboxGroup
                label="Required facilities"
                options={FACILITY_OPTIONS}
                values={form.facilities}
                onChange={(v) => set("facilities", v)}
              />
              <CheckboxGroup
                label="Accessibility needs"
                options={ACCESSIBILITY_OPTIONS}
                values={form.accessibility}
                onChange={(v) => set("accessibility", v)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <TextArea
                label="Equipment needs"
                value={form.equipmentNeeds}
                onChange={(e) => set("equipmentNeeds", e.target.value)}
                placeholder="e.g. Wireless microphones, projector, stage lighting"
              />
              <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={form.registrationEnabled}
                  onChange={(e) => set("registrationEnabled", e.target.checked)}
                />
                Enable attendee registration for this event
              </label>

              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-sm">
                <p className="mb-2 font-semibold text-gray-800 dark:text-gray-200">Review</p>
                <dl className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                  <dt className="text-gray-400 dark:text-gray-500">Name</dt>
                  <dd>{form.name || "—"}</dd>
                  <dt className="text-gray-400 dark:text-gray-500">Purpose</dt>
                  <dd>{form.purpose || "—"}</dd>
                  <dt className="text-gray-400 dark:text-gray-500">Attendance</dt>
                  <dd>{form.expectedAttendance || "—"}</dd>
                  <dt className="text-gray-400 dark:text-gray-500">Layout</dt>
                  <dd>{form.layout || "—"}</dd>
                </dl>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
          ← Back
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={saveDraft}>
            Save as Draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={goNext}>Continue ▶</Button>
          ) : (
            <Button onClick={submit}>Submit for Review</Button>
          )}
        </div>
      </div>
    </div>
  );
}
