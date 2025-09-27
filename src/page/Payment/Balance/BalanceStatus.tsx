
import { useGetTotalIncomeQuery } from "@/redux/api/payment/paymentApi"
import { useState } from "react"
import { Calendar, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import Loading from "@/components/Loading"
import Error from "@/components/Error"

const BalanceStatus = () => {
    const [filter, setFilter] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily")
    const [fromDate, setFromDate] = useState<string>("")
    const [toDate, setToDate] = useState<string>("")

    // Build query params
    const queryParams =
        filter === "custom" && fromDate && toDate
            ? [
                { name: "from", value: fromDate },
                { name: "to", value: toDate },
            ]
            : [{ name: "type", value: filter }]

    // Call API
    const { data, isLoading, error } = useGetTotalIncomeQuery(queryParams, {
        skip: filter === "custom" && (!fromDate || !toDate), // wait until both dates selected
    })

    // Decide which field to show
    const totalIncome = filter === "custom" ? data?.data?.custom || 0 : data?.data?.[filter] || 0

    const filterOptions = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
        { value: "custom", label: "Custom Range" },
    ]

    return (
        <div className="">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ff4c30]/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-[#ff4c30]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Balance Status</h2>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Filter Buttons */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Period</label>
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilter(option.value as any)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${filter === option.value
                                    ? "bg-[#ff4c30] text-white shadow-lg shadow-[#ff4c30]/25 scale-105"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Date Range Picker */}
                {filter === "custom" && (
                    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4c30] focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4c30] focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                {isLoading ? (
                    <Loading />
                ) : error ? (
                    <Error />
                ) : (
                    <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Total Income ({filter === "custom" ? "Custom Range" : filter})
                        </p>
                        <div className="text-4xl font-bold text-[#ff4c30] tracking-tight">৳{totalIncome.toLocaleString()}</div>
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Bangladeshi Taka</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BalanceStatus
