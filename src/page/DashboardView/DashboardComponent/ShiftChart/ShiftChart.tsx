/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { useGetAllShiftWithStdPercentageQuery } from "@/redux/api/shiftApi/shiftApi";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

const ShiftChart = () => {
  const { data: shiftData } = useGetAllShiftWithStdPercentageQuery(undefined);
  const shifts = shiftData?.data || [];

  const shiftDistribution = shifts.map((item: string, index: number) => {
    const parts = item.trim().split(" ");
    const percentStr = parts[parts.length - 1]; // "100%"
    const name = parts.slice(0, -1).join(" ");  // "10:00 AM - 11:30 AM"
    const percentValue = parseFloat(percentStr.replace("%", ""));

    return {
      name,
      value: percentValue,
      color: colorPalette[index % colorPalette.length],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift Distribution</CardTitle>
        <CardDescription>
          Overall distribution of students across time slots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={shiftDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {shiftDistribution.map((entry:any, index:any) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftChart;
