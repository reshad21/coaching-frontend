/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { TrendingUp, Users, GraduationCap, Clock } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StudentChartSkeleton from "./student-chart-skeleton";

// Modern gradient color palette
const GRADIENT_COLORS = [
  { start: "#6366f1", end: "#8b5cf6" },
  { start: "#22c55e", end: "#10b981" },
  { start: "#f59e0b", end: "#f97316" },
  { start: "#ec4899", end: "#f43f5e" },
  { start: "#06b6d4", end: "#0ea5e9" },
  { start: "#8b5cf6", end: "#a855f7" },
  { start: "#14b8a6", end: "#2dd4bf" },
  { start: "#ef4444", end: "#f87171" },
];

const SOLID_COLORS = [
  "#6366f1", "#22c55e", "#f59e0b", "#ec4899", 
  "#06b6d4", "#8b5cf6", "#14b8a6", "#ef4444"
];

const StudentChart = () => {
  const { data: students, isLoading } = useGetAllStudentQuery(undefined);
  const studentData = students?.data || [];
  const totalStudents = studentData.length;

  // Group students by class
  const classDistribution = studentData.reduce((acc: any, student: any) => {
    const className = student.className || "Unknown";
    acc[className] = (acc[className] || 0) + 1;
    return acc;
  }, {});

  const classData = Object.entries(classDistribution)
    .map(([name, value], index) => ({
      name,
      value: value as number,
      color: SOLID_COLORS[index % SOLID_COLORS.length],
      percentage: ((value as number) / totalStudents * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  // Group students by shift
  const shiftDistribution = studentData.reduce((acc: any, student: any) => {
    const shiftName = student.shiftName || "Unknown";
    acc[shiftName] = (acc[shiftName] || 0) + 1;
    return acc;
  }, {});

  const shiftData = Object.entries(shiftDistribution)
    .map(([name, value], index) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      fullName: name,
      students: value as number,
      color: SOLID_COLORS[index % SOLID_COLORS.length],
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 8);

  // Group students by batch
  const batchDistribution = studentData.reduce((acc: any, student: any) => {
    const batchName = student.batchName || "Unknown";
    acc[batchName] = (acc[batchName] || 0) + 1;
    return acc;
  }, {});

  const batchData = Object.entries(batchDistribution)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      fullName: name,
      students: value as number,
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 10);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{payload[0].payload.fullName || payload[0].payload.name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{payload[0].value}</span> students
          </p>
        </div>
      );
    }
    return null;
  };

  // Pie tooltip
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{payload[0].name}</p>
          <p className="text-xs mt-1">
            <span className="font-bold text-indigo-600 text-lg">{payload[0].value}</span>
            <span className="text-gray-500 ml-1">students ({payload[0].payload.percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <StudentChartSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-500/25">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-100 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold mt-1">{totalStudents}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white shadow-lg shadow-green-500/25">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-100 uppercase tracking-wide">Classes</p>
                <p className="text-3xl font-bold mt-1">{classData.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-100 uppercase tracking-wide">Shifts</p>
                <p className="text-3xl font-bold mt-1">{Object.keys(shiftDistribution).length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 text-white shadow-lg shadow-pink-500/25">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-pink-100 uppercase tracking-wide">Batches</p>
                <p className="text-3xl font-bold mt-1">{Object.keys(batchDistribution).length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart - Students by Shift */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              Students by Shift
            </CardTitle>
            <CardDescription className="text-xs">Top shifts by student enrollment</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shiftData} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <defs>
                    {shiftData.map((_, index) => (
                      <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length].start} />
                        <stop offset="100%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length].end} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#6b7280' }} 
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                  <Bar dataKey="students" radius={[0, 8, 8, 0]} barSize={24}>
                    {shiftData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart - Students by Class */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              Students by Class
            </CardTitle>
            <CardDescription className="text-xs">Class-wise student distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {classData.map((_, index) => (
                      <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length].start} />
                        <stop offset="100%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length].end} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={classData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {classData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGradient${index})`}
                        className="drop-shadow-sm"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4 px-2">
              {classData.slice(0, 6).map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm" 
                    style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].end})` }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{entry.name}</span>
                  <span className="text-xs font-semibold ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Area Chart - Students by Batch */}
        <Card className="col-span-1 lg:col-span-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              Students by Batch
            </CardTitle>
            <CardDescription className="text-xs">Batch-wise enrollment overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={batchData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                    dot={{ fill: '#6366f1', strokeWidth: 3, r: 5, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 3, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentChart;
