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
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import DashNavber from "./DashboardComponent/DashNavber/DashNavber";
import QuickView from "./DashboardComponent/QuickView/QuickView";

// Sample data for demonstration with time-based shifts
const studentDistributionData = [
  { batch: "Batch A", "8:00-10:30": 25, "11:00-1:30": 15, class: "Grade 10" },
  { batch: "Batch B", "8:00-10:30": 30, "11:00-1:30": 20, class: "Grade 11" },
  { batch: "Batch C", "2:00-4:30": 20, "5:00-7:30": 25, class: "Grade 12" },
  { batch: "Batch D", "2:00-4:30": 35, "5:00-7:30": 10, class: "Grade 9" },
];

const shiftDistribution = [
  { name: "8:00-10:30", value: 55, color: "#0088FE" },
  { name: "11:00-1:30", value: 35, color: "#00C49F" },
  { name: "2:00-4:30", value: 55, color: "#FFBB28" },
  { name: "5:00-7:30", value: 35, color: "#FF8042" },
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

export function DashboardOverview() {
  return (
    <>
      <DashNavber />
      <div className="space-y-6">
        <QuickView/>

        <div className="grid gap-4 md:grid-cols-2">
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
                    <Bar
                      dataKey="8:00-10:30"
                      fill="var(--color-8\\:00-10\\:30)"
                    />
                    <Bar
                      dataKey="11:00-1:30"
                      fill="var(--color-11\\:00-1\\:30)"
                    />
                    <Bar
                      dataKey="2:00-4:30"
                      fill="var(--color-2\\:00-4\\:30)"
                    />
                    <Bar
                      dataKey="5:00-7:30"
                      fill="var(--color-5\\:00-7\\:30)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>
              Detailed view of each batch with class and shift information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentDistributionData.map((batch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{batch.batch}</h3>
                    <p className="text-sm text-muted-foreground">
                      {batch.class}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {batch["8:00-10:30"] > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {batch["8:00-10:30"]}
                        </div>
                        <div className="text-muted-foreground">8:00-10:30</div>
                      </div>
                    )}
                    {batch["11:00-1:30"] > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {batch["11:00-1:30"]}
                        </div>
                        <div className="text-muted-foreground">11:00-1:30</div>
                      </div>
                    )}
                    {batch["2:00-4:30"] > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-yellow-600">
                          {batch["2:00-4:30"]}
                        </div>
                        <div className="text-muted-foreground">2:00-4:30</div>
                      </div>
                    )}
                    {batch["5:00-7:30"] > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">
                          {batch["5:00-7:30"]}
                        </div>
                        <div className="text-muted-foreground">5:00-7:30</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-semibold">
                        {(batch["8:00-10:30"] || 0) +
                          (batch["11:00-1:30"] || 0) +
                          (batch["2:00-4:30"] || 0) +
                          (batch["5:00-7:30"] || 0)}
                      </div>
                      <div className="text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
