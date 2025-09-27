import { useGetTotalIncomeQuery } from "@/redux/api/payment/paymentApi";
import { useState } from "react";

const BalanceStatus = () => {
  const [filter, setFilter] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | "custom"
  >("daily");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Build query params
  const queryParams =
    filter === "custom" && fromDate && toDate
      ? [
          { name: "from", value: fromDate },
          { name: "to", value: toDate },
        ]
      : [{ name: "type", value: filter }];

  // Call API
  const { data, isLoading, error } = useGetTotalIncomeQuery(queryParams, {
    skip: filter === "custom" && (!fromDate || !toDate), // wait until both dates selected
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading income</div>;

  // Decide which field to show
  const totalIncome =
    filter === "custom"
      ? data?.data?.custom || 0
      : data?.data?.[filter] || 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Balance Status
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {["daily", "weekly", "monthly", "yearly", "custom"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === type
                ? "bg-[#ff4c30] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Custom Date Range Picker */}
      {filter === "custom" && (
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      )}

      {/* Total Income */}
      <div className="text-3xl font-bold text-[#ff4c30]">
        {totalIncome.toLocaleString()} TK
      </div>
    </div>
  );
};

export default BalanceStatus;
