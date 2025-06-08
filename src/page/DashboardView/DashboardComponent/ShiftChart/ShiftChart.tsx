import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const shiftDistribution = [
  { name: "8:00-10:30", value: 55, color: "#0088FE" },
  { name: "11:00-1:30", value: 35, color: "#00C49F" },
  { name: "2:00-4:30", value: 55, color: "#FFBB28" },
  { name: "5:00-7:30", value: 35, color: "#FF8042" },
];

const ShiftChart = () => {
  return (
    <>
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
                  {shiftDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ShiftChart;
