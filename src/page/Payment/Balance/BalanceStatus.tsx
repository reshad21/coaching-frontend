"use client";

import React, { useState } from "react";
import { useGetTotalIncomeQuery } from "@/redux/api/payment/paymentApi";

const BalanceStatus = () => {
  const { data, isLoading, error } = useGetTotalIncomeQuery(undefined);
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading income</div>;

  // Get the total based on current filter
  const totalIncome = data?.data?.[filter] || 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Balance Status</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {["daily", "weekly", "monthly", "yearly"].map((type) => (
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

      {/* Total Income */}
      <div className="text-3xl font-bold text-[#ff4c30]">
        {totalIncome.toLocaleString()} TK
      </div>
    </div>
  );
};

export default BalanceStatus;
