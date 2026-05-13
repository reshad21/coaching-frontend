/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";
import BatchDetailsSkeleton from "./BatchDetailsSkeleton";

// Gradient color schemes for batch cards
const BATCH_GRADIENTS = [
  { bg: "from-violet-500/10 to-purple-500/10", border: "border-violet-200", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  { bg: "from-blue-500/10 to-cyan-500/10", border: "border-blue-200", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  { bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-200", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "from-orange-500/10 to-amber-500/10", border: "border-orange-200", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  { bg: "from-rose-500/10 to-pink-500/10", border: "border-rose-200", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
  { bg: "from-indigo-500/10 to-blue-500/10", border: "border-indigo-200", icon: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700" },
];

const BatchDetails = () => {
  const { data: batchData, isLoading } = useGetAllBatchQuery(undefined);
  const batches = batchData?.data || [];

  // Calculate totals
  const totalStudents = batches.reduce((acc: number, batch: any) => acc + (batch?.students?.length || 0), 0);
  const totalBatches = batches.length;

  return (
    <>
      {isLoading ? (
        <BatchDetailsSkeleton />
      ) : (
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 shadow-lg shadow-violet-500/25">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                    Batch Details
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500 sm:text-base">
                    Overview of all batches with class and shift information
                  </CardDescription>
                </div>
              </div>
              {/* Summary Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{totalStudents} Students</span>
                </div>
                <div className="flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-3 py-1.5">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-700">{totalBatches} Batches</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {batches?.map((batch: any, index: number) => {
                const colorScheme = BATCH_GRADIENTS[index % BATCH_GRADIENTS.length];
                const studentCount = batch?.students?.length || 0;

                return (
                  <div
                    key={index}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:p-5`}
                  >
                    {/* Decorative background element */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                    {/* Header with batch name */}
                    <div className="relative mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`p-2 rounded-lg bg-white/80 shadow-sm flex-shrink-0 ${colorScheme.icon}`}>
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold leading-tight text-slate-800" title={batch?.batchName}>
                            {batch?.batchName}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">Batch #{index + 1}</p>
                        </div>
                      </div>
                      <Badge className={`${colorScheme.badge} w-fit border-0 text-xs font-semibold shadow-sm`}>
                        Active
                      </Badge>
                    </div>

                    {/* Info Grid */}
                    <div className="relative mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Class Info */}
                      <div className="flex min-w-0 items-center gap-2 rounded-lg bg-white/60 p-2.5 backdrop-blur-sm">
                        <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Class</p>
                          <p className="text-sm font-bold text-slate-700" title={batch?.Class?.className}>{batch?.Class?.className}</p>
                        </div>
                      </div>

                      {/* Shift Info */}
                      <div className="flex min-w-0 items-center gap-2 rounded-lg bg-white/60 p-2.5 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Shift</p>
                          <p className="text-sm font-bold text-slate-700" title={batch?.Shift?.shiftName}>{batch?.Shift?.shiftName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Student Count Footer */}
                    <div className="relative mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700">Total Students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-slate-800">{studentCount}</span>
                        {studentCount > 0 && (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {batches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-slate-100 mb-4">
                  <Layers className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No Batches Found</h3>
                <p className="text-sm text-slate-500">Create your first batch to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BatchDetails;
