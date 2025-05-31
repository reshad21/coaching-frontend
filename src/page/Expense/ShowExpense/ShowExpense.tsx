/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetAllExpenseQuery } from "@/redux/api/expense/expenseApi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ShowExpense = () => {
  const { data, isLoading: loadCosting } = useGetAllExpenseQuery(undefined);
  const costing = data?.data || [];

  const formattedData = costing.map((item: any) => ({
    ...item,
    formattedMonth: new Date(item.month + "-01").toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-4">Monthly Expense Report</h1>
      {loadCosting ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedMonth" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Revenue Bar */}
            <Bar dataKey="totalRevenue" fill="#4ade80" name="Total Revenue">
              <LabelList dataKey="totalRevenue" position="top" />
            </Bar>

            {/* Cost Bar */}
            <Bar dataKey="totalCost" fill="#facc15" name="Total Cost">
              <LabelList dataKey="totalCost" position="top" />
            </Bar>

            {/* Profit Bar */}
            <Bar dataKey="profit" fill="#f87171" name="Profit">
              <LabelList dataKey="profit" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ShowExpense;
