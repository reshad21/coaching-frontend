import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import QuickViewSkeleton from "./QuickViewSkeleton";

const QuickView = () => {
  const { data: students, isLoading: stdLoading } =
    useGetAllStudentQuery(undefined);
  const { data: totalClass, isLoading: clsLoading } =
    useGetAllClassQuery(undefined);
  const { data: totalBatch, isLoading: batchLoading } =
    useGetAllBatchQuery(undefined);
  const { data: totalShift, isLoading: shiftLoading } =
    useGetAllShiftQuery(undefined);
  return (
    <>
      {stdLoading || clsLoading || batchLoading || shiftLoading ? (
        <QuickViewSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students?.data?.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalClass?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">4 grades active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Batches
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalBatch?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across multiple shifts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Shifts
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalShift?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Time-based schedules
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default QuickView;
