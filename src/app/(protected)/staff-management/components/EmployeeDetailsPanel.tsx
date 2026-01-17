import Loader from "@/app/components/Loader";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Employee } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";
import { appointmentApi } from "@/app/services/appointment.api";
import { useState } from "react";

interface EmployeeDetailsPanelProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  loading?: boolean;
}

const EmployeeDetailsPanel = ({
  employee,
  onClose,
  onEdit,
  loading,
}: EmployeeDetailsPanelProps) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  if (!employee && !loading) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
        <Loader label="Loading employee details..." />
      </div>
    );
  }

  if (!employee) return null;

  const workingDays = Object.entries(employee.availability)
    .filter(([_, isWorking]) => isWorking)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between">
          <h2 className="text-xl font-semibold">Employee Details</h2>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex gap-4">
            <EmployeeAvatar employee={employee} />
            <div>
              <h3 className="text-2xl font-semibold">{employee.name}</h3>

              {/* ✅ ROLE NAME FIXED */}
              <p className="text-muted-foreground">
                {employee.role?.name || "No role assigned"}
              </p>

              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                iconName="Edit"
                onClick={() => onEdit(employee)}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p>📞 {employee.phone}</p>
            <p>✉️ {employee.email}</p>
          </div>

          {/* Working Days */}
          <div>
            <h4 className="font-semibold mb-2">Working Days</h4>
            <div className="flex flex-wrap gap-2">
              {workingDays.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Commission */}
          <div>
            <h4 className="font-semibold">Commission</h4>
            <p className="text-xl font-bold">{employee.commissionRate}%</p>
          </div>

          {/* View Schedule */}
          <Button
            fullWidth
            iconName="Calendar"
            onClick={async () => {
              setShowSchedule(true);
              if (appointments.length) return;

              try {
                setAppointmentsLoading(true);
                const data = await appointmentApi.getStaffAppointments({
                  staffId: employee.id,
                });
                setAppointments(data || []);
              } catch {
                setAppointmentsError("Failed to load appointments");
              } finally {
                setAppointmentsLoading(false);
              }
            }}
          >
            View Schedule
          </Button>

          {showSchedule && (
            <div className="border rounded p-4">
              {appointmentsLoading ? (
                <Loader label="Loading appointments..." />
              ) : appointmentsError ? (
                <p className="text-destructive">{appointmentsError}</p>
              ) : appointments.length === 0 ? (
                <p className="text-muted-foreground">No appointments found</p>
              ) : (
                appointments.map((a) => (
                  <div key={a._id} className="border-b py-2">
                    {a.customerId?.fullName} – {a.status}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPanel;
