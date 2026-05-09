import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StudentInfo } from "@/types/payment";
import { User } from "lucide-react";

interface StudentInfoCardProps {
  studentInfo: StudentInfo;
}

export function StudentInfoCard({ studentInfo }: StudentInfoCardProps) {
  return (
    <Card className="h-full relative overflow-hidden rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-100 via-white to-purple-100 shadow-sm">
      <CardHeader className="pt-5 pb-3 px-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-1.5 shadow-sm">
            <User className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Student Information
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm shrink-0">
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-bold tracking-tight text-slate-700 leading-none">
            {studentInfo.firstName} {studentInfo.lastName}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="font-medium text-slate-500">ID:</span>
            {studentInfo.studentId}
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="font-medium text-slate-500">Batch:</span>
            {studentInfo.batchName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}