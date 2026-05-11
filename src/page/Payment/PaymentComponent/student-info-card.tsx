/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StudentInfo } from "@/types/payment";
import { User, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentInfoCardProps {
  studentInfo: StudentInfo;
  totalPaid?: number;
}

export function StudentInfoCard({ studentInfo, totalPaid }: StudentInfoCardProps) {
  const fullName = `${studentInfo?.firstName || ""} ${studentInfo?.lastName || ""}`.trim();
  const phone = (studentInfo as any)?.phone || "";
  const classInfo = studentInfo?.className || "Not assigned";
  const scheduleInfo = studentInfo?.schedule || "No schedule";

  const confirmAndOpen = (label: string, href: string) => {
    // Use window.confirm for a simple confirmation. Can replace with a custom modal/toast later.
    const ok = window.confirm(`${label}?`);
    if (ok) {
      window.location.href = href;
    }
  };

  const handleCall = (num?: string) => {
    if (!num) return;
    confirmAndOpen(`Call ${num}`, `tel:${num}`);
  };

  const handleSms = (num?: string) => {
    if (!num) return;
    confirmAndOpen(`Send SMS to ${num}`, `sms:${num}`);
  };

  return (
    <Card className="h-full relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 via-white to-purple-100 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600" />

      <CardHeader className="pt-6 pb-3 px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600">
              <User className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Student Profile
            </span>
          </div>

          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
              <User className="h-5 w-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 truncate">{fullName || "Unknown Student"}</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">{classInfo} • {scheduleInfo}</p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50/80 px-3 py-2 text-right shrink-0">
            <div className="text-[11px] font-medium uppercase tracking-wide text-blue-700/80">Total Paid</div>
            <div className="text-base font-bold text-blue-800 mt-0.5">
              {typeof totalPaid === "number" ? `৳${totalPaid.toFixed(2)}` : "৳0.00"}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="rounded-xl bg-white/60 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Quick Contact</div>
              <div className="text-[11px] text-slate-400">Available actions</div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-md bg-white/90 shrink-0">
                  <Phone className="h-4 w-4 text-slate-700" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-500">Phone Number</div>
                  <div className="text-sm font-semibold text-slate-900 truncate">{phone || "—"}</div>
                </div>
              </div>

              {phone && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-700 hover:bg-white/90"
                    onClick={() => handleCall(phone)}
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-700 hover:bg-white/90"
                    onClick={() => handleSms(phone)}
                    title="SMS"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {!phone && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-md px-2.5 py-1.5">
                Add a phone number to enable quick contact actions.
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-white/80 px-3 py-2">
            <div>
              <p className="text-[11px] text-slate-500">Record</p>
              <p className="text-xs font-semibold text-slate-700">Student payment profile ready</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
              Synced
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}