/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { months } from "@/constants/months";

interface PaymentProgressCardProps {
  paidMonths: number;
  totalMonths: number;
  paidPercentage: number;
  nextUnpaidMonth: string | undefined;
  paymentsByMonth?: Record<string, any>;
}

export function PaymentProgressCard({
  paidMonths,
  totalMonths,
  paidPercentage,
  nextUnpaidMonth,
  paymentsByMonth = {},
}: PaymentProgressCardProps) {
  const isCompleted = paidPercentage === 100;


  return (
    <Card className="h-full relative overflow-hidden rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-100 via-white to-purple-100 shadow-sm flex flex-col">
      <CardHeader className="pt-5 pb-3 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-1.5 shadow-sm">
              {isCompleted
                ? <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                : <Clock className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              }
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Payment Progress
            </span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isCompleted
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 space-y-4 flex-1">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold tracking-tight text-slate-700 leading-none">
            {paidPercentage}%
            <span className="text-sm font-medium text-slate-400 ml-1">complete</span>
          </p>
          <p className="text-xs text-slate-400">
            <span className="font-medium text-slate-500">{paidMonths}</span> of{" "}
            <span className="font-medium text-slate-500">{totalMonths}</span> months paid
          </p>
        </div>
        <div className="w-full h-2 rounded-full bg-blue-100/80 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : "bg-gradient-to-r from-blue-400 to-purple-400"
            }`}
            style={{ width: `${paidPercentage}%` }}
          />
        </div>

        {/* Month Grid Visualization */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Month Status</p>
            <p className="text-xs text-slate-400">{paidMonths} Paid</p>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {months.map((month) => {
              const isPaid = !!paymentsByMonth[month];
              return (
                <div
                  key={month}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                    isPaid
                      ? "bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-md hover:shadow-lg"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                  title={`${month}: ${isPaid ? "Paid" : "Unpaid"}`}
                >
                  {month.slice(0, 3)}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 mt-auto">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-green-400" : "bg-blue-400"}`} />
          {nextUnpaidMonth
            ? `Next payment due: ${nextUnpaidMonth}`
            : "All payments completed"}
        </p>
      </CardFooter>
    </Card>
  );
}