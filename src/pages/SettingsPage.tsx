import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/FormControls";
import { roleLabels } from "@/components/layout/navConfig";

export function SettingsPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Settings" description="Profile and notification preferences." />
      <Card>
        <CardBody>
          <TextInput label="Name" value={currentUser.name} readOnly />
          <TextInput label="Email" value={currentUser.email} readOnly />
          <TextInput label="Role" value={roleLabels[currentUser.role]} readOnly />
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            This is a static draft — profile fields are read-only. Use the role switcher in the top
            bar to preview the app as a different role.
          </p>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardBody>
          <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Notification preferences</h2>
          {["Event submissions & decisions", "Venue booking updates", "Equipment updates", "Registration activity"].map(
            (label) => (
              <label key={label} className="mb-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                />
                {label}
              </label>
            )
          )}
        </CardBody>
      </Card>
    </div>
  );
}
