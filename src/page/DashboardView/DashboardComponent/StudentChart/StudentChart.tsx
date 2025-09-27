/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import StudentChartSkeleton from "./student-chart-skeleton";

// Color palette for different shifts
const colorPalette = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF7F50",
  "#87CEEB",
  "#FFA07A",
];

const StudentChart = () => {
  const { data: students, isLoading } = useGetAllStudentQuery(undefined);
  const studentData = students?.data || [];

  // Collect unique shifts
  const shiftList: string[] = Array.from(
    new Set(studentData.map((student: any) => student.shiftName).filter(Boolean))
  );

  // Assign color for each shift
  const chartConfig: Record<string, { label: string; color: string }> = {};
  shiftList.forEach((shift, index) => {
    chartConfig[shift] = {
      label: shift,
      color: colorPalette[index % colorPalette.length],
    };
  });

  // Group students by batch
  const studentDistributionData = studentData.reduce((acc: any[], student: any) => {
    const batch = student.batchName;
    const shift = student.shiftName;
    const className = student.className;

    if (!batch || !shift) return acc;

    let batchGroup = acc.find((item) => item.batch === batch);
    if (!batchGroup) {
      batchGroup = { batch, class: className };
      shiftList.forEach((s) => (batchGroup[s] = 0));
      acc.push(batchGroup);
    }

    batchGroup[shift] = (batchGroup[shift] || 0) + 1;
    return acc;
  }, []);

  return (
    <>
      {isLoading ? (
        <StudentChartSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Batch and Shift</CardTitle>
            <CardDescription>
              Number of students in each batch across dynamically detected shifts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {shiftList.map((shift) => (
                    <Bar
                      key={shift}
                      dataKey={shift}
                      fill={chartConfig[shift].color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StudentChart;
