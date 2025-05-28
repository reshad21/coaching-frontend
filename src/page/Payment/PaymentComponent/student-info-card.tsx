import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentInfo } from "@/types/payment";

interface StudentInfoCardProps {
  studentInfo: StudentInfo;
}

export function StudentInfoCard({ studentInfo }: StudentInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Student Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar>
          <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-semibold">
            <img
              src={`http://localhost:3000${studentInfo.image}`}
              alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
              className="size-10 rounded-sm object-cover"
            />
          </div>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">
            {studentInfo.firstName} {studentInfo.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            ID: {studentInfo.studentId}
          </p>
          <p className="text-sm text-muted-foreground">
            Batch: {studentInfo.batchName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
