/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  Layers,
  TrendingUp,
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Batch Details
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Overview of all batches with class and shift information
                  </CardDescription>
                </div>
              </div>
              {/* Summary Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{totalStudents} Students</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-full border border-violet-200">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-700">{totalBatches} Batches</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches?.map((batch: any, index: number) => {
                const colorScheme = BATCH_GRADIENTS[index % BATCH_GRADIENTS.length];
                const studentCount = batch?.students?.length || 0;
                
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group`}
                  >
                    {/* Decorative background element */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    
                    {/* Header with batch name */}
                    <div className="relative flex items-center justify-between mb-3 gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`p-2 rounded-lg bg-white/80 shadow-sm flex-shrink-0 ${colorScheme.icon}`}>
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-base leading-tight truncate" title={batch?.batchName}>
                            {batch?.batchName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">Batch #{index + 1}</p>
                        </div>
                      </div>
                      <Badge className={`${colorScheme.badge} border-0 font-semibold text-xs shadow-sm flex-shrink-0 whitespace-nowrap`}>
                        Active
                      </Badge>
                    </div>
                    
                    {/* Info Grid */}
                    <div className="relative grid grid-cols-2 gap-3 mt-4">
                      {/* Class Info */}
                      <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-lg backdrop-blur-sm min-w-0">
                        <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium whitespace-nowrap">Class</p>
                          <p className="text-sm font-bold text-slate-700 truncate" title={batch?.Class?.className}>{batch?.Class?.className}</p>
                        </div>
                      </div>
                      
                      {/* Shift Info */}
                      <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-lg backdrop-blur-sm min-w-0">
                        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium whitespace-nowrap">Shift</p>
                          <p className="text-sm font-bold text-slate-700 truncate" title={batch?.Shift?.shiftName}>{batch?.Shift?.shiftName}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Student Count Footer */}
                    <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 whitespace-nowrap">Total Students</span>
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
