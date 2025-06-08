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
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for demonstration with time-based shifts
const studentDistributionData = [
  { batch: "Batch A", "8:00-10:30": 25, "11:00-1:30": 15, class: "Grade 10" },
  { batch: "Batch B", "8:00-10:30": 30, "11:00-1:30": 20, class: "Grade 11" },
  { batch: "Batch C", "2:00-4:30": 20, "5:00-7:30": 25, class: "Grade 12" },
  { batch: "Batch D", "2:00-4:30": 35, "5:00-7:30": 10, class: "Grade 9" },
];

const chartConfig = {
  "8:00-10:30": {
    label: "8:00 AM - 10:30 AM",
    color: "#0088FE",
  },
  "11:00-1:30": {
    label: "11:00 AM - 1:30 PM",
    color: "#00C49F",
  },
  "2:00-4:30": {
    label: "2:00 PM - 4:30 PM",
    color: "#FFBB28",
  },
  "5:00-7:30": {
    label: "5:00 PM - 7:30 PM",
    color: "#FF8042",
  },
};

const StudentChart = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Distribution by Batch and Shift</CardTitle>
          <CardDescription>
            Number of students in each batch across different time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="8:00-10:30" fill="var(--color-8\\:00-10\\:30)" />
                <Bar dataKey="11:00-1:30" fill="var(--color-11\\:00-1\\:30)" />
                <Bar dataKey="2:00-4:30" fill="var(--color-2\\:00-4\\:30)" />
                <Bar dataKey="5:00-7:30" fill="var(--color-5\\:00-7\\:30)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default StudentChart;
